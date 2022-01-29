/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/big.js/big.js":
/*!************************************!*\
  !*** ./node_modules/big.js/big.js ***!
  \************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*
 *  big.js v6.1.1
 *  A small, fast, easy-to-use library for arbitrary-precision decimal arithmetic.
 *  Copyright (c) 2021 Michael Mclaughlin
 *  https://github.com/MikeMcl/big.js/LICENCE.md
 */
;(function (GLOBAL) {
  'use strict';
  var Big,


/************************************** EDITABLE DEFAULTS *****************************************/


    // The default values below must be integers within the stated ranges.

    /*
     * The maximum number of decimal places (DP) of the results of operations involving division:
     * div and sqrt, and pow with negative exponents.
     */
    DP = 20,            // 0 to MAX_DP

    /*
     * The rounding mode (RM) used when rounding to the above decimal places.
     *
     *  0  Towards zero (i.e. truncate, no rounding).       (ROUND_DOWN)
     *  1  To nearest neighbour. If equidistant, round up.  (ROUND_HALF_UP)
     *  2  To nearest neighbour. If equidistant, to even.   (ROUND_HALF_EVEN)
     *  3  Away from zero.                                  (ROUND_UP)
     */
    RM = 1,             // 0, 1, 2 or 3

    // The maximum value of DP and Big.DP.
    MAX_DP = 1E6,       // 0 to 1000000

    // The maximum magnitude of the exponent argument to the pow method.
    MAX_POWER = 1E6,    // 1 to 1000000

    /*
     * The negative exponent (NE) at and beneath which toString returns exponential notation.
     * (JavaScript numbers: -7)
     * -1000000 is the minimum recommended exponent value of a Big.
     */
    NE = -7,            // 0 to -1000000

    /*
     * The positive exponent (PE) at and above which toString returns exponential notation.
     * (JavaScript numbers: 21)
     * 1000000 is the maximum recommended exponent value of a Big, but this limit is not enforced.
     */
    PE = 21,            // 0 to 1000000

    /*
     * When true, an error will be thrown if a primitive number is passed to the Big constructor,
     * or if valueOf is called, or if toNumber is called on a Big which cannot be converted to a
     * primitive number without a loss of precision.
     */
    STRICT = false,     // true or false


/**************************************************************************************************/


    // Error messages.
    NAME = '[big.js] ',
    INVALID = NAME + 'Invalid ',
    INVALID_DP = INVALID + 'decimal places',
    INVALID_RM = INVALID + 'rounding mode',
    DIV_BY_ZERO = NAME + 'Division by zero',

    // The shared prototype object.
    P = {},
    UNDEFINED = void 0,
    NUMERIC = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;


  /*
   * Create and return a Big constructor.
   */
  function _Big_() {

    /*
     * The Big constructor and exported function.
     * Create and return a new instance of a Big number object.
     *
     * n {number|string|Big} A numeric value.
     */
    function Big(n) {
      var x = this;

      // Enable constructor usage without new.
      if (!(x instanceof Big)) return n === UNDEFINED ? _Big_() : new Big(n);

      // Duplicate.
      if (n instanceof Big) {
        x.s = n.s;
        x.e = n.e;
        x.c = n.c.slice();
      } else {
        if (typeof n !== 'string') {
          if (Big.strict === true) {
            throw TypeError(INVALID + 'number');
          }

          // Minus zero?
          n = n === 0 && 1 / n < 0 ? '-0' : String(n);
        }

        parse(x, n);
      }

      // Retain a reference to this Big constructor.
      // Shadow Big.prototype.constructor which points to Object.
      x.constructor = Big;
    }

    Big.prototype = P;
    Big.DP = DP;
    Big.RM = RM;
    Big.NE = NE;
    Big.PE = PE;
    Big.strict = STRICT;
    Big.roundDown = 0;
    Big.roundHalfUp = 1;
    Big.roundHalfEven = 2;
    Big.roundUp = 3;

    return Big;
  }


  /*
   * Parse the number or string value passed to a Big constructor.
   *
   * x {Big} A Big number instance.
   * n {number|string} A numeric value.
   */
  function parse(x, n) {
    var e, i, nl;

    if (!NUMERIC.test(n)) {
      throw Error(INVALID + 'number');
    }

    // Determine sign.
    x.s = n.charAt(0) == '-' ? (n = n.slice(1), -1) : 1;

    // Decimal point?
    if ((e = n.indexOf('.')) > -1) n = n.replace('.', '');

    // Exponential form?
    if ((i = n.search(/e/i)) > 0) {

      // Determine exponent.
      if (e < 0) e = i;
      e += +n.slice(i + 1);
      n = n.substring(0, i);
    } else if (e < 0) {

      // Integer.
      e = n.length;
    }

    nl = n.length;

    // Determine leading zeros.
    for (i = 0; i < nl && n.charAt(i) == '0';) ++i;

    if (i == nl) {

      // Zero.
      x.c = [x.e = 0];
    } else {

      // Determine trailing zeros.
      for (; nl > 0 && n.charAt(--nl) == '0';);
      x.e = e - i - 1;
      x.c = [];

      // Convert string to array of digits without leading/trailing zeros.
      for (e = 0; i <= nl;) x.c[e++] = +n.charAt(i++);
    }

    return x;
  }


  /*
   * Round Big x to a maximum of sd significant digits using rounding mode rm.
   *
   * x {Big} The Big to round.
   * sd {number} Significant digits: integer, 0 to MAX_DP inclusive.
   * rm {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
   * [more] {boolean} Whether the result of division was truncated.
   */
  function round(x, sd, rm, more) {
    var xc = x.c;

    if (rm === UNDEFINED) rm = x.constructor.RM;
    if (rm !== 0 && rm !== 1 && rm !== 2 && rm !== 3) {
      throw Error(INVALID_RM);
    }

    if (sd < 1) {
      more =
        rm === 3 && (more || !!xc[0]) || sd === 0 && (
        rm === 1 && xc[0] >= 5 ||
        rm === 2 && (xc[0] > 5 || xc[0] === 5 && (more || xc[1] !== UNDEFINED))
      );

      xc.length = 1;

      if (more) {

        // 1, 0.1, 0.01, 0.001, 0.0001 etc.
        x.e = x.e - sd + 1;
        xc[0] = 1;
      } else {

        // Zero.
        xc[0] = x.e = 0;
      }
    } else if (sd < xc.length) {

      // xc[sd] is the digit after the digit that may be rounded up.
      more =
        rm === 1 && xc[sd] >= 5 ||
        rm === 2 && (xc[sd] > 5 || xc[sd] === 5 &&
          (more || xc[sd + 1] !== UNDEFINED || xc[sd - 1] & 1)) ||
        rm === 3 && (more || !!xc[0]);

      // Remove any digits after the required precision.
      xc.length = sd--;

      // Round up?
      if (more) {

        // Rounding up may mean the previous digit has to be rounded up.
        for (; ++xc[sd] > 9;) {
          xc[sd] = 0;
          if (!sd--) {
            ++x.e;
            xc.unshift(1);
          }
        }
      }

      // Remove trailing zeros.
      for (sd = xc.length; !xc[--sd];) xc.pop();
    }

    return x;
  }


  /*
   * Return a string representing the value of Big x in normal or exponential notation.
   * Handles P.toExponential, P.toFixed, P.toJSON, P.toPrecision, P.toString and P.valueOf.
   */
  function stringify(x, doExponential, isNonzero) {
    var e = x.e,
      s = x.c.join(''),
      n = s.length;

    // Exponential notation?
    if (doExponential) {
      s = s.charAt(0) + (n > 1 ? '.' + s.slice(1) : '') + (e < 0 ? 'e' : 'e+') + e;

    // Normal notation.
    } else if (e < 0) {
      for (; ++e;) s = '0' + s;
      s = '0.' + s;
    } else if (e > 0) {
      if (++e > n) {
        for (e -= n; e--;) s += '0';
      } else if (e < n) {
        s = s.slice(0, e) + '.' + s.slice(e);
      }
    } else if (n > 1) {
      s = s.charAt(0) + '.' + s.slice(1);
    }

    return x.s < 0 && isNonzero ? '-' + s : s;
  }


  // Prototype/instance methods


  /*
   * Return a new Big whose value is the absolute value of this Big.
   */
  P.abs = function () {
    var x = new this.constructor(this);
    x.s = 1;
    return x;
  };


  /*
   * Return 1 if the value of this Big is greater than the value of Big y,
   *       -1 if the value of this Big is less than the value of Big y, or
   *        0 if they have the same value.
   */
  P.cmp = function (y) {
    var isneg,
      x = this,
      xc = x.c,
      yc = (y = new x.constructor(y)).c,
      i = x.s,
      j = y.s,
      k = x.e,
      l = y.e;

    // Either zero?
    if (!xc[0] || !yc[0]) return !xc[0] ? !yc[0] ? 0 : -j : i;

    // Signs differ?
    if (i != j) return i;

    isneg = i < 0;

    // Compare exponents.
    if (k != l) return k > l ^ isneg ? 1 : -1;

    j = (k = xc.length) < (l = yc.length) ? k : l;

    // Compare digit by digit.
    for (i = -1; ++i < j;) {
      if (xc[i] != yc[i]) return xc[i] > yc[i] ^ isneg ? 1 : -1;
    }

    // Compare lengths.
    return k == l ? 0 : k > l ^ isneg ? 1 : -1;
  };


  /*
   * Return a new Big whose value is the value of this Big divided by the value of Big y, rounded,
   * if necessary, to a maximum of Big.DP decimal places using rounding mode Big.RM.
   */
  P.div = function (y) {
    var x = this,
      Big = x.constructor,
      a = x.c,                  // dividend
      b = (y = new Big(y)).c,   // divisor
      k = x.s == y.s ? 1 : -1,
      dp = Big.DP;

    if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
      throw Error(INVALID_DP);
    }

    // Divisor is zero?
    if (!b[0]) {
      throw Error(DIV_BY_ZERO);
    }

    // Dividend is 0? Return +-0.
    if (!a[0]) {
      y.s = k;
      y.c = [y.e = 0];
      return y;
    }

    var bl, bt, n, cmp, ri,
      bz = b.slice(),
      ai = bl = b.length,
      al = a.length,
      r = a.slice(0, bl),   // remainder
      rl = r.length,
      q = y,                // quotient
      qc = q.c = [],
      qi = 0,
      p = dp + (q.e = x.e - y.e) + 1;    // precision of the result

    q.s = k;
    k = p < 0 ? 0 : p;

    // Create version of divisor with leading zero.
    bz.unshift(0);

    // Add zeros to make remainder as long as divisor.
    for (; rl++ < bl;) r.push(0);

    do {

      // n is how many times the divisor goes into current remainder.
      for (n = 0; n < 10; n++) {

        // Compare divisor and remainder.
        if (bl != (rl = r.length)) {
          cmp = bl > rl ? 1 : -1;
        } else {
          for (ri = -1, cmp = 0; ++ri < bl;) {
            if (b[ri] != r[ri]) {
              cmp = b[ri] > r[ri] ? 1 : -1;
              break;
            }
          }
        }

        // If divisor < remainder, subtract divisor from remainder.
        if (cmp < 0) {

          // Remainder can't be more than 1 digit longer than divisor.
          // Equalise lengths using divisor with extra leading zero?
          for (bt = rl == bl ? b : bz; rl;) {
            if (r[--rl] < bt[rl]) {
              ri = rl;
              for (; ri && !r[--ri];) r[ri] = 9;
              --r[ri];
              r[rl] += 10;
            }
            r[rl] -= bt[rl];
          }

          for (; !r[0];) r.shift();
        } else {
          break;
        }
      }

      // Add the digit n to the result array.
      qc[qi++] = cmp ? n : ++n;

      // Update the remainder.
      if (r[0] && cmp) r[rl] = a[ai] || 0;
      else r = [a[ai]];

    } while ((ai++ < al || r[0] !== UNDEFINED) && k--);

    // Leading zero? Do not remove if result is simply zero (qi == 1).
    if (!qc[0] && qi != 1) {

      // There can't be more than one zero.
      qc.shift();
      q.e--;
      p--;
    }

    // Round?
    if (qi > p) round(q, p, Big.RM, r[0] !== UNDEFINED);

    return q;
  };


  /*
   * Return true if the value of this Big is equal to the value of Big y, otherwise return false.
   */
  P.eq = function (y) {
    return this.cmp(y) === 0;
  };


  /*
   * Return true if the value of this Big is greater than the value of Big y, otherwise return
   * false.
   */
  P.gt = function (y) {
    return this.cmp(y) > 0;
  };


  /*
   * Return true if the value of this Big is greater than or equal to the value of Big y, otherwise
   * return false.
   */
  P.gte = function (y) {
    return this.cmp(y) > -1;
  };


  /*
   * Return true if the value of this Big is less than the value of Big y, otherwise return false.
   */
  P.lt = function (y) {
    return this.cmp(y) < 0;
  };


  /*
   * Return true if the value of this Big is less than or equal to the value of Big y, otherwise
   * return false.
   */
  P.lte = function (y) {
    return this.cmp(y) < 1;
  };


  /*
   * Return a new Big whose value is the value of this Big minus the value of Big y.
   */
  P.minus = P.sub = function (y) {
    var i, j, t, xlty,
      x = this,
      Big = x.constructor,
      a = x.s,
      b = (y = new Big(y)).s;

    // Signs differ?
    if (a != b) {
      y.s = -b;
      return x.plus(y);
    }

    var xc = x.c.slice(),
      xe = x.e,
      yc = y.c,
      ye = y.e;

    // Either zero?
    if (!xc[0] || !yc[0]) {
      if (yc[0]) {
        y.s = -b;
      } else if (xc[0]) {
        y = new Big(x);
      } else {
        y.s = 1;
      }
      return y;
    }

    // Determine which is the bigger number. Prepend zeros to equalise exponents.
    if (a = xe - ye) {

      if (xlty = a < 0) {
        a = -a;
        t = xc;
      } else {
        ye = xe;
        t = yc;
      }

      t.reverse();
      for (b = a; b--;) t.push(0);
      t.reverse();
    } else {

      // Exponents equal. Check digit by digit.
      j = ((xlty = xc.length < yc.length) ? xc : yc).length;

      for (a = b = 0; b < j; b++) {
        if (xc[b] != yc[b]) {
          xlty = xc[b] < yc[b];
          break;
        }
      }
    }

    // x < y? Point xc to the array of the bigger number.
    if (xlty) {
      t = xc;
      xc = yc;
      yc = t;
      y.s = -y.s;
    }

    /*
     * Append zeros to xc if shorter. No need to add zeros to yc if shorter as subtraction only
     * needs to start at yc.length.
     */
    if ((b = (j = yc.length) - (i = xc.length)) > 0) for (; b--;) xc[i++] = 0;

    // Subtract yc from xc.
    for (b = i; j > a;) {
      if (xc[--j] < yc[j]) {
        for (i = j; i && !xc[--i];) xc[i] = 9;
        --xc[i];
        xc[j] += 10;
      }

      xc[j] -= yc[j];
    }

    // Remove trailing zeros.
    for (; xc[--b] === 0;) xc.pop();

    // Remove leading zeros and adjust exponent accordingly.
    for (; xc[0] === 0;) {
      xc.shift();
      --ye;
    }

    if (!xc[0]) {

      // n - n = +0
      y.s = 1;

      // Result must be zero.
      xc = [ye = 0];
    }

    y.c = xc;
    y.e = ye;

    return y;
  };


  /*
   * Return a new Big whose value is the value of this Big modulo the value of Big y.
   */
  P.mod = function (y) {
    var ygtx,
      x = this,
      Big = x.constructor,
      a = x.s,
      b = (y = new Big(y)).s;

    if (!y.c[0]) {
      throw Error(DIV_BY_ZERO);
    }

    x.s = y.s = 1;
    ygtx = y.cmp(x) == 1;
    x.s = a;
    y.s = b;

    if (ygtx) return new Big(x);

    a = Big.DP;
    b = Big.RM;
    Big.DP = Big.RM = 0;
    x = x.div(y);
    Big.DP = a;
    Big.RM = b;

    return this.minus(x.times(y));
  };


  /*
   * Return a new Big whose value is the value of this Big plus the value of Big y.
   */
  P.plus = P.add = function (y) {
    var e, k, t,
      x = this,
      Big = x.constructor;

    y = new Big(y);

    // Signs differ?
    if (x.s != y.s) {
      y.s = -y.s;
      return x.minus(y);
    }

    var xe = x.e,
      xc = x.c,
      ye = y.e,
      yc = y.c;

    // Either zero?
    if (!xc[0] || !yc[0]) {
      if (!yc[0]) {
        if (xc[0]) {
          y = new Big(x);
        } else {
          y.s = x.s;
        }
      }
      return y;
    }

    xc = xc.slice();

    // Prepend zeros to equalise exponents.
    // Note: reverse faster than unshifts.
    if (e = xe - ye) {
      if (e > 0) {
        ye = xe;
        t = yc;
      } else {
        e = -e;
        t = xc;
      }

      t.reverse();
      for (; e--;) t.push(0);
      t.reverse();
    }

    // Point xc to the longer array.
    if (xc.length - yc.length < 0) {
      t = yc;
      yc = xc;
      xc = t;
    }

    e = yc.length;

    // Only start adding at yc.length - 1 as the further digits of xc can be left as they are.
    for (k = 0; e; xc[e] %= 10) k = (xc[--e] = xc[e] + yc[e] + k) / 10 | 0;

    // No need to check for zero, as +x + +y != 0 && -x + -y != 0

    if (k) {
      xc.unshift(k);
      ++ye;
    }

    // Remove trailing zeros.
    for (e = xc.length; xc[--e] === 0;) xc.pop();

    y.c = xc;
    y.e = ye;

    return y;
  };


  /*
   * Return a Big whose value is the value of this Big raised to the power n.
   * If n is negative, round to a maximum of Big.DP decimal places using rounding
   * mode Big.RM.
   *
   * n {number} Integer, -MAX_POWER to MAX_POWER inclusive.
   */
  P.pow = function (n) {
    var x = this,
      one = new x.constructor('1'),
      y = one,
      isneg = n < 0;

    if (n !== ~~n || n < -MAX_POWER || n > MAX_POWER) {
      throw Error(INVALID + 'exponent');
    }

    if (isneg) n = -n;

    for (;;) {
      if (n & 1) y = y.times(x);
      n >>= 1;
      if (!n) break;
      x = x.times(x);
    }

    return isneg ? one.div(y) : y;
  };


  /*
   * Return a new Big whose value is the value of this Big rounded to a maximum precision of sd
   * significant digits using rounding mode rm, or Big.RM if rm is not specified.
   *
   * sd {number} Significant digits: integer, 1 to MAX_DP inclusive.
   * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
   */
  P.prec = function (sd, rm) {
    if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
      throw Error(INVALID + 'precision');
    }
    return round(new this.constructor(this), sd, rm);
  };


  /*
   * Return a new Big whose value is the value of this Big rounded to a maximum of dp decimal places
   * using rounding mode rm, or Big.RM if rm is not specified.
   * If dp is negative, round to an integer which is a multiple of 10**-dp.
   * If dp is not specified, round to 0 decimal places.
   *
   * dp? {number} Integer, -MAX_DP to MAX_DP inclusive.
   * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
   */
  P.round = function (dp, rm) {
    if (dp === UNDEFINED) dp = 0;
    else if (dp !== ~~dp || dp < -MAX_DP || dp > MAX_DP) {
      throw Error(INVALID_DP);
    }
    return round(new this.constructor(this), dp + this.e + 1, rm);
  };


  /*
   * Return a new Big whose value is the square root of the value of this Big, rounded, if
   * necessary, to a maximum of Big.DP decimal places using rounding mode Big.RM.
   */
  P.sqrt = function () {
    var r, c, t,
      x = this,
      Big = x.constructor,
      s = x.s,
      e = x.e,
      half = new Big('0.5');

    // Zero?
    if (!x.c[0]) return new Big(x);

    // Negative?
    if (s < 0) {
      throw Error(NAME + 'No square root');
    }

    // Estimate.
    s = Math.sqrt(x + '');

    // Math.sqrt underflow/overflow?
    // Re-estimate: pass x coefficient to Math.sqrt as integer, then adjust the result exponent.
    if (s === 0 || s === 1 / 0) {
      c = x.c.join('');
      if (!(c.length + e & 1)) c += '0';
      s = Math.sqrt(c);
      e = ((e + 1) / 2 | 0) - (e < 0 || e & 1);
      r = new Big((s == 1 / 0 ? '5e' : (s = s.toExponential()).slice(0, s.indexOf('e') + 1)) + e);
    } else {
      r = new Big(s + '');
    }

    e = r.e + (Big.DP += 4);

    // Newton-Raphson iteration.
    do {
      t = r;
      r = half.times(t.plus(x.div(t)));
    } while (t.c.slice(0, e).join('') !== r.c.slice(0, e).join(''));

    return round(r, (Big.DP -= 4) + r.e + 1, Big.RM);
  };


  /*
   * Return a new Big whose value is the value of this Big times the value of Big y.
   */
  P.times = P.mul = function (y) {
    var c,
      x = this,
      Big = x.constructor,
      xc = x.c,
      yc = (y = new Big(y)).c,
      a = xc.length,
      b = yc.length,
      i = x.e,
      j = y.e;

    // Determine sign of result.
    y.s = x.s == y.s ? 1 : -1;

    // Return signed 0 if either 0.
    if (!xc[0] || !yc[0]) {
      y.c = [y.e = 0];
      return y;
    }

    // Initialise exponent of result as x.e + y.e.
    y.e = i + j;

    // If array xc has fewer digits than yc, swap xc and yc, and lengths.
    if (a < b) {
      c = xc;
      xc = yc;
      yc = c;
      j = a;
      a = b;
      b = j;
    }

    // Initialise coefficient array of result with zeros.
    for (c = new Array(j = a + b); j--;) c[j] = 0;

    // Multiply.

    // i is initially xc.length.
    for (i = b; i--;) {
      b = 0;

      // a is yc.length.
      for (j = a + i; j > i;) {

        // Current sum of products at this digit position, plus carry.
        b = c[j] + yc[i] * xc[j - i - 1] + b;
        c[j--] = b % 10;

        // carry
        b = b / 10 | 0;
      }

      c[j] = b;
    }

    // Increment result exponent if there is a final carry, otherwise remove leading zero.
    if (b) ++y.e;
    else c.shift();

    // Remove trailing zeros.
    for (i = c.length; !c[--i];) c.pop();
    y.c = c;

    return y;
  };


  /*
   * Return a string representing the value of this Big in exponential notation rounded to dp fixed
   * decimal places using rounding mode rm, or Big.RM if rm is not specified.
   *
   * dp? {number} Decimal places: integer, 0 to MAX_DP inclusive.
   * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
   */
  P.toExponential = function (dp, rm) {
    var x = this,
      n = x.c[0];

    if (dp !== UNDEFINED) {
      if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
        throw Error(INVALID_DP);
      }
      x = round(new x.constructor(x), ++dp, rm);
      for (; x.c.length < dp;) x.c.push(0);
    }

    return stringify(x, true, !!n);
  };


  /*
   * Return a string representing the value of this Big in normal notation rounded to dp fixed
   * decimal places using rounding mode rm, or Big.RM if rm is not specified.
   *
   * dp? {number} Decimal places: integer, 0 to MAX_DP inclusive.
   * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
   *
   * (-0).toFixed(0) is '0', but (-0.1).toFixed(0) is '-0'.
   * (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
   */
  P.toFixed = function (dp, rm) {
    var x = this,
      n = x.c[0];

    if (dp !== UNDEFINED) {
      if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
        throw Error(INVALID_DP);
      }
      x = round(new x.constructor(x), dp + x.e + 1, rm);

      // x.e may have changed if the value is rounded up.
      for (dp = dp + x.e + 1; x.c.length < dp;) x.c.push(0);
    }

    return stringify(x, false, !!n);
  };


  /*
   * Return a string representing the value of this Big.
   * Return exponential notation if this Big has a positive exponent equal to or greater than
   * Big.PE, or a negative exponent equal to or less than Big.NE.
   * Omit the sign for negative zero.
   */
  P.toJSON = P.toString = function () {
    var x = this,
      Big = x.constructor;
    return stringify(x, x.e <= Big.NE || x.e >= Big.PE, !!x.c[0]);
  };


  /*
   * Return the value of this Big as a primitve number.
   */
  P.toNumber = function () {
    var n = Number(stringify(this, true, true));
    if (this.constructor.strict === true && !this.eq(n.toString())) {
      throw Error(NAME + 'Imprecise conversion');
    }
    return n;
  };


  /*
   * Return a string representing the value of this Big rounded to sd significant digits using
   * rounding mode rm, or Big.RM if rm is not specified.
   * Use exponential notation if sd is less than the number of digits necessary to represent
   * the integer part of the value in normal notation.
   *
   * sd {number} Significant digits: integer, 1 to MAX_DP inclusive.
   * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
   */
  P.toPrecision = function (sd, rm) {
    var x = this,
      Big = x.constructor,
      n = x.c[0];

    if (sd !== UNDEFINED) {
      if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
        throw Error(INVALID + 'precision');
      }
      x = round(new Big(x), sd, rm);
      for (; x.c.length < sd;) x.c.push(0);
    }

    return stringify(x, sd <= x.e || x.e <= Big.NE || x.e >= Big.PE, !!n);
  };


  /*
   * Return a string representing the value of this Big.
   * Return exponential notation if this Big has a positive exponent equal to or greater than
   * Big.PE, or a negative exponent equal to or less than Big.NE.
   * Include the sign for negative zero.
   */
  P.valueOf = function () {
    var x = this,
      Big = x.constructor;
    if (Big.strict === true) {
      throw Error(NAME + 'valueOf disallowed');
    }
    return stringify(x, x.e <= Big.NE || x.e >= Big.PE, true);
  };


  // Export


  Big = _Big_();

  Big['default'] = Big.Big = Big;

  //AMD.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () { return Big; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

  // Node and other CommonJS-like environments that support module.exports.
  } else {}
})(this);


/***/ }),

/***/ "./src/css/style.css":
/*!***************************!*\
  !*** ./src/css/style.css ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/js/modules/application/calcApplication.ts":
/*!*******************************************************!*\
  !*** ./src/js/modules/application/calcApplication.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CalcApplication": () => (/* binding */ CalcApplication)
/* harmony export */ });
/* harmony import */ var _domain_service_calcRepository__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../domain/service/calcRepository */ "./src/js/modules/domain/service/calcRepository.ts");
/* harmony import */ var _domain_model_calc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../domain/model/calc */ "./src/js/modules/domain/model/calc.ts");


var CalcApplication = /** @class */ (function () {
    function CalcApplication() {
        this.calcRepository = new _domain_service_calcRepository__WEBPACK_IMPORTED_MODULE_0__.CalcRepository();
    }
    /**
     * RPN配列をセットします。
     * @param {array} rpnArr RPN配列
     */
    CalcApplication.prototype.setRpnArr = function (rpnArr) {
        this.calcRepository.save(rpnArr);
    };
    /**
     * 計算結果を文字列で渡します。
     *
     * なお、この関数は**確実に数値を返すとは限りません**。例えば"NaN"などを返す可能性もあります。
     *
     * @param {Array} rpnArr RPN配列
     * @returns {string} 計算結果
     */
    CalcApplication.prototype.calc = function (rpnArr) {
        if (rpnArr === void 0) { rpnArr = null; }
        if (rpnArr !== null) {
            this.setRpnArr(rpnArr);
        }
        var calc = new _domain_model_calc__WEBPACK_IMPORTED_MODULE_1__.Calc(this.calcRepository.getRpnArr());
        return calc.rpnCalc();
    };
    return CalcApplication;
}());



/***/ }),

/***/ "./src/js/modules/application/convertApplication.ts":
/*!**********************************************************!*\
  !*** ./src/js/modules/application/convertApplication.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ConvertApplication": () => (/* binding */ ConvertApplication)
/* harmony export */ });
/* harmony import */ var _domain_service_convertRepository__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../domain/service/convertRepository */ "./src/js/modules/domain/service/convertRepository.ts");
/* harmony import */ var _domain_model_convert__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../domain/model/convert */ "./src/js/modules/domain/model/convert.ts");


var ConvertApplication = /** @class */ (function () {
    function ConvertApplication() {
        this.convertRepository = new _domain_service_convertRepository__WEBPACK_IMPORTED_MODULE_0__.ConvertRepository();
    }
    /**
     * 計算式をセットします。計算式の演算子については[演算子について](https://github.com/poyuaki/coaca.ts#%E6%BC%94%E7%AE%97%E5%AD%90%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6)を参照してください。
     *
     * @param formula 計算式
     */
    ConvertApplication.prototype.setFormula = function (formula) {
        this.convertRepository.save(formula);
    };
    /**
     * RPN配列を返します。
     * @returns {array} RPN配列
     */
    ConvertApplication.prototype.convertRpn = function () {
        var convert = new _domain_model_convert__WEBPACK_IMPORTED_MODULE_1__.Convert(this.convertRepository.getFormula());
        return convert.convertToRPN();
    };
    return ConvertApplication;
}());



/***/ }),

/***/ "./src/js/modules/application/variableApplication.ts":
/*!***********************************************************!*\
  !*** ./src/js/modules/application/variableApplication.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VariableApplication": () => (/* binding */ VariableApplication)
/* harmony export */ });
/* harmony import */ var _domain_service_variableRepository__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../domain/service/variableRepository */ "./src/js/modules/domain/service/variableRepository.ts");
/* harmony import */ var _domain_model_variable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../domain/model/variable */ "./src/js/modules/domain/model/variable.ts");


var VariableApplication = /** @class */ (function () {
    function VariableApplication() {
        this.VariableRepository = new _domain_service_variableRepository__WEBPACK_IMPORTED_MODULE_0__.VariableRepository();
    }
    /**
     * 変数に代入する前のRPN配列に対して変数を代入します。
     *
     * @param {array} rpnArr RPN配列
     * @returns {array} 代入し終わったRPN配列
     */
    VariableApplication.prototype.convertVariable = function (rpnArr) {
        var variable = new _domain_model_variable__WEBPACK_IMPORTED_MODULE_1__.Variable();
        var variableList = this.VariableRepository.getVariableList();
        return variable.convertVariable(rpnArr, variableList);
    };
    /**
     * 変数を新しく生成します。変数については[変数について](https://github.com/poyuaki/coaca.ts#%E5%A4%89%E6%95%B0%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6)を参照してください。
     *
     * @param name 変数名
     * @param value 初期値
     */
    VariableApplication.prototype.addVariable = function (name, value) {
        var variable = new _domain_model_variable__WEBPACK_IMPORTED_MODULE_1__.Variable();
        var variableList = this.VariableRepository.getVariableList();
        var newVariableList = {
            name: name,
            value: value,
            isDefault: false
        };
        variable.checkVariable(newVariableList, variableList);
        this.VariableRepository.save(newVariableList);
    };
    /**
     * 指定した変数を変更します。
     *
     * @param name 変数名
     * @param value 変更後の値
     */
    VariableApplication.prototype.changeVariable = function (name, value) {
        var variable = new _domain_model_variable__WEBPACK_IMPORTED_MODULE_1__.Variable();
        var variableList = this.VariableRepository.getVariableList();
        variable.isDefaultVariable(name, variableList);
        this.VariableRepository.changeVariable(name, value);
    };
    /**
     * 指定した変数を削除します。
     *
     * @param name 変数名
     */
    VariableApplication.prototype.removeVariable = function (name) {
        var variable = new _domain_model_variable__WEBPACK_IMPORTED_MODULE_1__.Variable();
        var variableList = this.VariableRepository.getVariableList();
        variable.isDefaultVariable(name, variableList);
        this.VariableRepository.removeVariable(name);
    };
    return VariableApplication;
}());



/***/ }),

/***/ "./src/js/modules/domain/model/calc.ts":
/*!*********************************************!*\
  !*** ./src/js/modules/domain/model/calc.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Calc": () => (/* binding */ Calc)
/* harmony export */ });
/* harmony import */ var _formulaControl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./formulaControl */ "./src/js/modules/domain/model/formulaControl.ts");

/**
 * RPN配列に対して計算を行うクラス
 */
var Calc = /** @class */ (function () {
    function Calc(rpnArr) {
        this.rpnArr = rpnArr;
    }
    /**
     * RPN配列に格納されている数式を基に計算を行う
     * @returns 計算結果(文字列)
     */
    Calc.prototype.rpnCalc = function (rpnArr) {
        if (rpnArr === void 0) { rpnArr = null; }
        var stack = [];
        var fcClass = new _formulaControl__WEBPACK_IMPORTED_MODULE_0__.FormulaControl();
        var targetArr = rpnArr === null ? this.rpnArr : rpnArr;
        for (var i = 0; i < targetArr.length; i++) {
            var val = targetArr[i];
            if (!fcClass.isOperator(val) && !fcClass.isSpecialOperator(val) && !fcClass.isBracket(val))
                stack.push(val);
            if (fcClass.isSpecialOperator(val)) {
                var startIndex = 0;
                var nestCount = 0;
                var endIndex = 0;
                for (var j = i + 1; j < targetArr.length; j++) {
                    if (targetArr[j] === '[') {
                        if (nestCount === 0)
                            startIndex = j + 1;
                        nestCount++;
                    }
                    if (targetArr[j] === ']')
                        nestCount--;
                    if (nestCount === 0 && !fcClass.isOperator(targetArr[j])) {
                        endIndex = j;
                        break;
                    }
                    if (j + 1 === targetArr.length) {
                        endIndex = j + 1;
                        break;
                    }
                }
                var subRpnArr = targetArr.slice(startIndex, endIndex);
                var subCalc = new Calc(subRpnArr);
                stack.push(String(fcClass.specialCalc(val, subCalc.rpnCalc())));
                i = endIndex;
            }
            else if (fcClass.isOperator(val)) {
                stack.push(String(fcClass.calculate(val, stack.pop(), stack.pop())));
            }
        }
        return stack[0];
    };
    return Calc;
}());



/***/ }),

/***/ "./src/js/modules/domain/model/convert.ts":
/*!************************************************!*\
  !*** ./src/js/modules/domain/model/convert.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Convert": () => (/* binding */ Convert)
/* harmony export */ });
/* harmony import */ var _formulaControl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./formulaControl */ "./src/js/modules/domain/model/formulaControl.ts");

var Convert = /** @class */ (function () {
    function Convert(formula) {
        this.formula = formula;
    }
    Convert.prototype.setOperatorAndNum = function (formula) {
        var res = [];
        var add = '';
        var flag = false;
        var fcClass = new _formulaControl__WEBPACK_IMPORTED_MODULE_0__.FormulaControl();
        for (var i = 0; i < formula.length; i++) {
            var val = formula.substring(i, i + 1);
            val = val.replace(/\s+/g, "");
            if (!fcClass.isOperator(val) && !fcClass.isParren(val) && !fcClass.isBracket(val)) {
                add += val;
            }
            else {
                if (add !== '') {
                    // 負数の場合の記述
                    if (val === ')' && flag) {
                        add = '-' + add;
                        flag = false;
                    }
                    res.push(add); // 数値があったら
                }
                if (res[res.length - 1] === '(' && val === '-') {
                    flag = true;
                    continue;
                }
                else {
                    res.push(val);
                }
                add = '';
            }
        }
        if (add !== '')
            res.push(add);
        return res;
    };
    Convert.prototype.exchange = function (data) {
        if (data === void 0) { data = ''; }
        var res = [];
        var stock = [];
        var flag = false;
        var formula = data === '' ? this.formula : data;
        var valList = this.setOperatorAndNum(formula);
        var fcClass = new _formulaControl__WEBPACK_IMPORTED_MODULE_0__.FormulaControl();
        for (var i = 0; i < valList.length; i++) {
            var val = valList[i];
            if (val === '')
                continue;
            if (!(fcClass.isOperator(val) || fcClass.isParren(val))) {
                res.push(val);
                if (stock.length)
                    res.push(stock.pop());
            }
            else if (fcClass.isOperator(val)) {
                if (!stock.length && !res.length && val === '-') {
                    var num = valList.slice(i, valList.length).join('');
                    res.push(num);
                    break;
                }
                if (flag && fcClass.importanceNum(val) > fcClass.importanceNum(res[res.length - 1]))
                    stock.push(res.pop());
                flag = true;
                stock.push(val);
            }
            else if (fcClass.isParren(val)) {
                var startIndex = i + 1;
                var nestCount = 0;
                var endIndex = 0;
                for (var j = i; j < valList.length; j++) {
                    if (valList[j] === '(')
                        nestCount++;
                    if (valList[j] === ')')
                        nestCount--;
                    if (nestCount === 0) {
                        endIndex = j;
                        break;
                    }
                    if (j + 1 === valList.length) {
                        endIndex = j + 1;
                        break;
                    }
                }
                var subFormula = valList.slice(startIndex, endIndex).join('');
                res.push.apply(res, this.exchange(subFormula));
                if (stock.length)
                    res.push(stock.pop());
                i = endIndex;
            }
        }
        stock.forEach(function (i) { return res.push(i); });
        return res;
    };
    Convert.prototype.convertToRPN = function () {
        return this.exchange();
    };
    return Convert;
}());



/***/ }),

/***/ "./src/js/modules/domain/model/formulaControl.ts":
/*!*******************************************************!*\
  !*** ./src/js/modules/domain/model/formulaControl.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FormulaControl": () => (/* binding */ FormulaControl)
/* harmony export */ });
/* harmony import */ var big_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! big.js */ "./node_modules/big.js/big.js");
/* harmony import */ var big_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(big_js__WEBPACK_IMPORTED_MODULE_0__);

var FormulaControl = /** @class */ (function () {
    function FormulaControl() {
        this.operatorList = ['+', '-', '*', '/', '^', '_', '%'];
        this.specialOperatorList = ['sin', 'cos', 'tan', '!', 'rad', 'abs', 'asin', 'acos', 'atan', 'ln'];
    }
    /**
     * 検索対象が演算子であるかどうか
     * @param val 検索対象の文字
     * @returns 結果
     */
    FormulaControl.prototype.isOperator = function (val) {
        return this.operatorList.indexOf(val) !== -1;
    };
    FormulaControl.prototype.isSpecialOperator = function (val) {
        return this.specialOperatorList.indexOf(val) !== -1;
    };
    /**
     * 検索対象が丸括弧であるかどうか
     * @param val 検索対象の文字列
     * @returns 結果
     */
    FormulaControl.prototype.isParren = function (val) {
        return val === '(' || val === ')';
    };
    /**
     * 検索対象が角括弧であるかどうか
     * @param val 対象の文字列
     * @returns 結果
     */
    FormulaControl.prototype.isBracket = function (val) {
        return val === '[' || val === ']';
    };
    /**
     * 演算子に従った計算を行う
     * @param ope 演算子
     * @param val1 数値1(文字列)
     * @param val2 数値2(文字列)
     * @returns 計算結果
     */
    FormulaControl.prototype.calculate = function (ope, val1, val2) {
        var num1 = Number(val1);
        var num2 = Number(val2);
        var getBaseLog = function (x, y) {
            return Math.log(x) / Math.log(y);
        };
        switch (ope) {
            case '+':
                var plus = new big_js__WEBPACK_IMPORTED_MODULE_0__.Big(num1);
                return plus.plus(num2);
            case '-':
                var minus = new big_js__WEBPACK_IMPORTED_MODULE_0__.Big(num2);
                return minus.minus(num1);
            case '*':
                return num1 * num2;
            case '/':
                var div = new big_js__WEBPACK_IMPORTED_MODULE_0__.Big(num2);
                return div.div(num1);
            case '^':
                return Math.pow(num2, num1);
            case '%':
                return num2 % num1;
            case '_':
                return getBaseLog(num1, num2);
            default:
                return 0;
        }
    };
    FormulaControl.prototype.factorialize = function (num) {
        if (num === 0)
            return 1;
        return num * this.factorialize(num - 1);
    };
    FormulaControl.prototype.specialCalc = function (ope, value) {
        var num = Number(value);
        switch (ope) {
            case 'sin':
                return Math.sin(num);
            case 'cos':
                return Math.cos(num);
            case 'tan':
                return Math.tan(num);
            case '!':
                return this.factorialize(num);
            case 'rad':
                return num * Math.PI / 180;
            case 'abs':
                return Math.abs(num);
            case 'asin':
                return Math.asin(num);
            case 'acos':
                return Math.acos(num);
            case 'atan':
                return Math.atan(num);
            case 'ln':
                return Math.log(num);
            default:
                return 0;
        }
    };
    /**
     * 対象によって異なる重みを返す
     * @param val 対象の文字
     * @returns 重要度
     */
    FormulaControl.prototype.importanceNum = function (val) {
        if (this.isParren(val) || this.isBracket(val))
            return 5;
        if (val === '^' || val === '%' || val === '_')
            return 4;
        if (val === '*' || val === '/')
            return 3;
        if (val === '+' || val === '-')
            return 2;
        else
            return 1;
    };
    return FormulaControl;
}());



/***/ }),

/***/ "./src/js/modules/domain/model/variable.ts":
/*!*************************************************!*\
  !*** ./src/js/modules/domain/model/variable.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Variable": () => (/* binding */ Variable)
/* harmony export */ });
/* harmony import */ var _formulaControl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./formulaControl */ "./src/js/modules/domain/model/formulaControl.ts");

var Variable = /** @class */ (function () {
    function Variable() {
    }
    /**
     * 数式内に用いられている変数を代入
     * @param rpnArr RPN配列
     * @returns 変換後の配列
     */
    Variable.prototype.convertVariable = function (rpnArr, variableList) {
        var resArr;
        resArr = rpnArr;
        var _loop_1 = function (i) {
            variableList.forEach(function (variable) {
                if (variable.name === resArr[i]) {
                    resArr[i] = String(variable.value);
                }
            });
        };
        for (var i = 0; i < resArr.length; i++) {
            _loop_1(i);
        }
        return resArr;
    };
    /**
     * 検索対象の文字列が変数として既に登録されているか
     * @param name 検索対象の文字列
     * @returns 変数の配列に存在するか
     */
    Variable.prototype.isInVariableList = function (name, variableList) {
        var flag = false;
        variableList.forEach(function (variable) {
            if (variable.name === name)
                flag = true;
        });
        return flag;
    };
    Variable.prototype.checkVariable = function (newVariableList, variableList) {
        var _this = this;
        var isTrueVariableName = function (name) {
            var fcClass = new _formulaControl__WEBPACK_IMPORTED_MODULE_0__.FormulaControl();
            var isInOpeOrBra = function (nameOpe) {
                for (var i = 0; i < nameOpe.length; i++) {
                    var val = nameOpe.substring(i, i + 1);
                    if (fcClass.isOperator(val) || fcClass.isParren(val) || fcClass.isBracket(val) || fcClass.isSpecialOperator(val))
                        return true;
                }
                return false;
            };
            return !(name.length > 20 || isInOpeOrBra(name) || _this.isInVariableList(name, variableList));
        };
        if (!isTrueVariableName(newVariableList.name)) {
            throw new Error("The variable name \"".concat(newVariableList.name, "\" is not in the correct format."));
        }
    };
    Variable.prototype.isDefaultVariable = function (target, variableList) {
        // 変数のisDefaultがtrueならthrow
        for (var _i = 0, variableList_1 = variableList; _i < variableList_1.length; _i++) {
            var variable = variableList_1[_i];
            if (variable.name === target && variable.isDefault) {
                throw new Error("The variable \"".concat(target, "\" is a default variable."));
            }
        }
    };
    return Variable;
}());



/***/ }),

/***/ "./src/js/modules/domain/service/calcRepository.ts":
/*!*********************************************************!*\
  !*** ./src/js/modules/domain/service/calcRepository.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CalcRepository": () => (/* binding */ CalcRepository)
/* harmony export */ });
var CalcRepository = /** @class */ (function () {
    function CalcRepository() {
        this.rpnArr = [];
    }
    CalcRepository.prototype.save = function (rpnArr) {
        this.rpnArr = rpnArr;
    };
    CalcRepository.prototype.getRpnArr = function () {
        return this.rpnArr;
    };
    return CalcRepository;
}());



/***/ }),

/***/ "./src/js/modules/domain/service/convertRepository.ts":
/*!************************************************************!*\
  !*** ./src/js/modules/domain/service/convertRepository.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ConvertRepository": () => (/* binding */ ConvertRepository)
/* harmony export */ });
var ConvertRepository = /** @class */ (function () {
    function ConvertRepository() {
        this.formula = '';
    }
    ConvertRepository.prototype.save = function (formula) {
        this.formula = formula;
    };
    ConvertRepository.prototype.getFormula = function () {
        return this.formula;
    };
    return ConvertRepository;
}());



/***/ }),

/***/ "./src/js/modules/domain/service/variableRepository.ts":
/*!*************************************************************!*\
  !*** ./src/js/modules/domain/service/variableRepository.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VariableRepository": () => (/* binding */ VariableRepository)
/* harmony export */ });
var VariableRepository = /** @class */ (function () {
    function VariableRepository() {
        this.variableList = [
            {
                name: 'pie',
                value: Math.PI,
                isDefault: true
            },
            {
                name: 'e',
                value: Math.E,
                isDefault: true
            },
            {
                name: 'K',
                value: 1000,
                isDefault: true
            },
            {
                name: 'M',
                value: 1000000,
                isDefault: true
            },
            {
                name: 'G',
                value: 1000000000,
                isDefault: true
            },
            {
                name: 'm',
                value: 0.001,
                isDefault: true
            },
            {
                name: 'μ',
                value: 0.000001,
                isDefault: true
            },
            {
                name: 'n',
                value: 0.000000001,
                isDefault: true
            }
        ];
    }
    VariableRepository.prototype.save = function (variableObj) {
        this.variableList.push(variableObj);
    };
    VariableRepository.prototype.findByName = function (name) {
        return this.variableList.find(function (item) { return item.name === name; });
    };
    VariableRepository.prototype.getVariableList = function () {
        return this.variableList;
    };
    /**
     * 指定した変数を変更する
     * @param name 変数名
     * @param value 変更後の値
     */
    VariableRepository.prototype.changeVariable = function (name, value) {
        this.variableList.forEach(function (item) {
            if (item.name === name)
                item.value = value;
        });
    };
    /**
     * 指定した変数を削除する
     * @param name 変数名
     */
    VariableRepository.prototype.removeVariable = function (name) {
        this.variableList = this.variableList.filter(function (item) { return item.name !== name || item.isDefault; });
    };
    return VariableRepository;
}());



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*************************!*\
  !*** ./src/js/index.ts ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_application_calcApplication__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/application/calcApplication */ "./src/js/modules/application/calcApplication.ts");
/* harmony import */ var _modules_application_convertApplication__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/application/convertApplication */ "./src/js/modules/application/convertApplication.ts");
/* harmony import */ var _modules_application_variableApplication__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/application/variableApplication */ "./src/js/modules/application/variableApplication.ts");
/* harmony import */ var _css_style_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../css/style.css */ "./src/css/style.css");




var variable = new _modules_application_variableApplication__WEBPACK_IMPORTED_MODULE_2__.VariableApplication();
function submitCalc() {
    var convert = new _modules_application_convertApplication__WEBPACK_IMPORTED_MODULE_1__.ConvertApplication();
    var val = document.getElementById('formulaInput');
    convert.setFormula(val.value);
    var rpn = convert.convertRpn();
    rpn = variable.convertVariable(rpn);
    var calc = new _modules_application_calcApplication__WEBPACK_IMPORTED_MODULE_0__.CalcApplication();
    calc.setRpnArr(rpn);
    var result = calc.calc();
    val.value = result;
}
document.getElementById('formulaForm').addEventListener('submit', function (e) {
    e.preventDefault();
    submitCalc();
});

})();

/******/ })()
;
//# sourceMappingURL=index.js.map