/**
 * Single source of truth for the Эрээн (China-side) warehouse contact details
 * shown on the public site. Previously this was hand-typed independently in
 * both `EreenAddressSection` and `ContactSection`, which had drifted out of
 * sync (a stray space inside the Chinese address). Import from here instead
 * of retyping the address/phone.
 */
export const EREEN_WAREHOUSE = {
  recipientHint: "WECARGO + таны утас/код",
  addressCn: "内蒙古锡林郭勒盟二连浩特市环宇商贸城五号楼125号业顺额尔敦商贸有限公司",
  phone: "15148615407",
} as const;
