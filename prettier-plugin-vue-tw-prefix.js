// prettier-plugin-vue-tw-prefix.js
import { parsers as htmlParsers } from "prettier/parser-html";

function addPrefixToClassList(classStr) {
  return classStr
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((c) => (c.startsWith("tw:") ? c : `tw:${c}`))
    .join(" ");
}

// ساده‌ساز: استخراج رشته‌ها از داخل آرایه ['a','b'] یا ["a","b"]
function transformArrayLiteral(str) {
  const items = [];
  const re = /(['"])([^'"]+)\1/g;
  let m;
  while ((m = re.exec(str))) {
    const cls = m[2];
    items.push(cls.startsWith("tw:") ? cls : `tw:${cls}`);
  }
  return `[${items.map((s) => `'${s}'`).join(", ")}]`;
}

// ساده‌ساز: تبدیل کلیدهای رشته‌ای در آبجکت { 'a': cond, "b": ok }
function transformObjectLiteral(str) {
  return str.replace(
    /(['"])([^'"]+)\1\s*:/g,
    (_match, q, key) => `${q}${key.startsWith("tw:") ? key : `tw:${key}`}${q}:`,
  );
}

function transformVueTemplate(text) {
  let out = text;

  // class="..."
  out = out.replace(/class\s*=\s*("([^"]*)"|'([^']*)')/g, (m, _q, d, s) => {
    const classes = d ?? s ?? "";
    const updated = addPrefixToClassList(classes);
    // همیشه با " برگردونیم تا یکدست باشه
    return `class="${updated}"`;
  });

  // :class=" '...' "  یا  :class=' "..." '
  out = out.replace(/:class\s*=\s*("([^"]*)"|'([^']*)')/g, (m, _q, d, s) => {
    const expr = (d ?? s ?? "").trim();

    // 1) رشته‌ی ساده
    const singleStr = /^(['"])([^'"]+)\1$/;
    const m1 = expr.match(singleStr);
    if (m1) {
      const inner = m1[2];
      const updated = addPrefixToClassList(inner);
      return `:class="'${updated}'"`;
    }

    // 2) آرایه‌ی رشته‌ها: ['a','b'] یا ["a","b"]
    if (/^\[\s*(['"])[\s\S]*\1\s*\]$/.test(expr)) {
      try {
        const updated = transformArrayLiteral(expr);
        return `:class="${updated}"`;
      } catch {
        return m; // اگر الگو عجیب بود، دست نزن
      }
    }

    // 3) آبجکت با کلیدهای رشته‌ای: { 'a': cond, "b": ok }
    if (/^\{\s*(['"])[\s\S]*\1\s*:[\s\S]*\}$/.test(expr)) {
      try {
        const updated = transformObjectLiteral(expr);
        return `:class="${updated}"`;
      } catch {
        return m;
      }
    }

    // حالت‌های پیچیده: دست نمی‌زنیم
    return m;
  });

  return out;
}

export const parsers = {
  // پارسر Vue در Prettier اسمش 'vue' هست و از parser-html میاد
  vue: {
    ...htmlParsers.html,
    preprocess(code) {
      // فقط بخش‌های <template> رو هدف می‌گیریم
      return code.replace(
        /(<template[^>]*>)([\s\S]*?)(<\/template>)/g,
        (_all, open, tpl, close) => open + transformVueTemplate(tpl) + close,
      );
    },
  },
};
