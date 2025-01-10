// GET handler - /api/confirm/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { decrypt } from "@/lib/crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  try {
    // Decrypt the token
    const decryptedToken = decrypt(token);
    const [email, contactId, timestamp] = decryptedToken.split(":");

    // Check if the token is expired (e.g., after 24 hours)
    const tokenAge = Date.now() - parseInt(timestamp);
    if (tokenAge > 24 * 60 * 60 * 1000) {
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }

    console.log("Email:", email, "Contact ID:", contactId);

    // Update user status in Resend audience to subscribed using the contact ID
    await resend.contacts.update({
      id: contactId,
      unsubscribed: false,
      audienceId: process.env.RESEND_AUDIENCE_ID as string,
    });

    return NextResponse.json({ message: "Email confirmed successfully" });
  } catch (error) {
    console.error("Error confirming email:", error);
    return NextResponse.json(
      { error: "Error confirming email" },
      { status: 500 }
    );
  }
}
