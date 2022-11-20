import { VendorPayload } from "./Vendor.dto";
import {UserPayload } from "./User.dto";

export type AuthPayload = UserPayload | VendorPayload;