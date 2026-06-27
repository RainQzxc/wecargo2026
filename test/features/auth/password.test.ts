import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/features/auth/password";

describe("hashPassword", () => {
  it("produces the scrypt$salt$key format", () => {
    const stored = hashPassword("s3cret");
    const parts = stored.split("$");
    expect(parts).toHaveLength(3);
    expect(parts[0]).toBe("scrypt");
    expect(parts[1]).toMatch(/^[0-9a-f]+$/); // salt hex
    expect(parts[2]).toMatch(/^[0-9a-f]+$/); // derived key hex
  });

  it("uses a random salt, so the same password hashes differently", () => {
    expect(hashPassword("same")).not.toBe(hashPassword("same"));
  });
});

describe("verifyPassword", () => {
  it("accepts the correct password", () => {
    const stored = hashPassword("correct horse");
    expect(verifyPassword("correct horse", stored)).toBe(true);
  });

  it("rejects an incorrect password", () => {
    const stored = hashPassword("correct horse");
    expect(verifyPassword("wrong horse", stored)).toBe(false);
  });

  it("returns false for null or undefined stored value", () => {
    expect(verifyPassword("anything", null)).toBe(false);
    expect(verifyPassword("anything", undefined)).toBe(false);
  });

  it("returns false for an empty stored value", () => {
    expect(verifyPassword("anything", "")).toBe(false);
  });

  it("returns false for a malformed stored value (wrong part count)", () => {
    expect(verifyPassword("pw", "scrypt$onlytwo")).toBe(false);
    expect(verifyPassword("pw", "a$b$c$d")).toBe(false);
  });

  it("returns false for an unknown algorithm prefix", () => {
    const stored = hashPassword("pw");
    const tampered = stored.replace("scrypt", "bcrypt");
    expect(verifyPassword("pw", tampered)).toBe(false);
  });

  it("is case-sensitive", () => {
    const stored = hashPassword("Password");
    expect(verifyPassword("password", stored)).toBe(false);
  });
});
