#!/usr/bin/env python3
"""
PFM spoken-number naturalizer — convert digit dollar amounts to natural spoken-read
form for Veo TTS (so a number reads the way a person says it, not robotically).

Locked B6 rules (Sam 2026-06-12, Christian Hall Home Moving States build):
  high   : HIGH/"bad" yearly rates -> round to nearest 100, "X hundred"
           (state rate, neighbor's old rate, the narrator's old CA rate)
  low    : LOW/PAYOFF yearly rates -> EXACT two-pair, NO rounding
           (the lander's low rate, "my new quote") — keeps the deal attractive
  quote  : bare quote-lists -> EXACT two-pair, NO rounding
  month  : monthly rates -> EXACT two-pair (reads fine, stays accurate)
  delta  : "an extra $X a month" small amounts -> natural
  savings: floor to nearest 50, prefixed "over ..."
  plain  : generic integer -> spoken words (e.g. 900 -> "nine hundred")
  million: $1.2 million -> "one point two million" (handle inline, not here)

Usage:
  python3 naturalize.py <amount> <type>      # type: high|low|quote|month|delta|savings|plain
  python3 naturalize.py 4695 high            -> forty seven hundred
  python3 naturalize.py 1968 low             -> nineteen sixty eight
  python3 naturalize.py 876  savings         -> over eight hundred fifty
  echo '{"v":4224,"t":"high"}' | python3 naturalize.py --json
"""
import sys, json

ONES={0:"",1:"one",2:"two",3:"three",4:"four",5:"five",6:"six",7:"seven",8:"eight",9:"nine",
10:"ten",11:"eleven",12:"twelve",13:"thirteen",14:"fourteen",15:"fifteen",16:"sixteen",
17:"seventeen",18:"eighteen",19:"nineteen"}
TENS={2:"twenty",3:"thirty",4:"forty",5:"fifty",6:"sixty",7:"seventy",8:"eighty",9:"ninety"}

def two(n):
    if n<20: return ONES[n]
    t,o=divmod(n,10); return TENS[t]+(" "+ONES[o] if o else "")   # SPACE, never a hyphen (dashes break Veo TTS)
def hund(n):
    h,r=divmod(n,100); return ONES[h]+" hundred"+(" "+two(r) if r else "")
def words(n):
    if n>=1000:
        th,r=divmod(n,1000); s=(two(th) if th>=20 else ONES[th])+" thousand"
        return s+(" "+(two(r) if r<100 else hund(r)) if r else "")
    return hund(n) if n>=100 else two(n)
def pair(n):                       # exact two-pair: 4695->forty-six ninety-five, 5016->fifty sixteen, 4080->forty eighty
    a,b=divmod(n,100); sa=two(a) if a<100 else words(a)
    return sa+" hundred" if b==0 else sa+" "+(two(b) if b>=10 else "oh "+ONES[b])
def high(n):                       # round to nearest 100 -> "X hundred" / "X thousand"
    r=round(n/100)*100
    return words(r) if r%1000==0 else (two(r//100) if r//100<100 else words(r//100))+" hundred"
def savings(n):                    # floor to nearest 50, "over ..."
    return "over "+words((n//50)*50)
def delta(n):                      # small extra-per-month
    return two(n) if n<100 else pair(n)

def high_num(n):                   # numeral + word alt (Sam 07-11): 4695 -> "47 hundred", 1500 -> "15 hundred"
    r=round(n/100)
    return words(r*100) if (r%10==0 and r>=10) else f"{r} hundred"

FN={"high":high,"highnum":high_num,"low":pair,"quote":pair,"month":pair,"delta":delta,"savings":savings,"plain":words}

def naturalize(amount, kind):
    amount=int(round(float(amount)))
    return FN[kind](amount)

if __name__=="__main__":
    if len(sys.argv)==2 and sys.argv[1]=="--json":
        d=json.load(sys.stdin); print(naturalize(d["v"], d["t"]))
    elif len(sys.argv)==3:
        print(naturalize(sys.argv[1], sys.argv[2]))
    else:
        print(__doc__); sys.exit(1)
