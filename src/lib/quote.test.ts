import { describe, expect, it } from "vitest";
import { isValidPhone, validateQuote } from "./quote";

const base = { name: "Nguyễn Văn A", company: "", phone: "0853 748 898", email: "", msg: "" };

describe("isValidPhone", () => {
  it.each(["0853748898", "0853 748 898", "0853.748.898", "0853-748-898", "+84853748898", "+84 853 748 898", "(0236) 3812 345"])(
    "chấp nhận %s",
    (phone) => expect(isValidPhone(phone)).toBe(true),
  );

  it.each(["", "12345", "abc", "0853 748 898 ext", "+84 853 748 898 123 456 789", "++84853748898"])("từ chối %s", (phone) =>
    expect(isValidPhone(phone)).toBe(false),
  );
});

describe("validateQuote", () => {
  it("hợp lệ khi có tên và số điện thoại", () => {
    expect(validateQuote(base)).toEqual({});
  });

  it("báo lỗi từng trường", () => {
    expect(validateQuote({ ...base, name: "  ", phone: "12", email: "sai@" })).toEqual({
      name: "Vui lòng nhập họ tên",
      phone: "Số điện thoại chưa hợp lệ",
      email: "Email chưa hợp lệ",
    });
  });

  it("email là tuỳ chọn, chỉ khoảng trắng coi như bỏ trống", () => {
    expect(validateQuote({ ...base, email: "   " })).toEqual({});
    expect(validateQuote({ ...base, email: "sales@anhtrisholdings.com" })).toEqual({});
  });
});
