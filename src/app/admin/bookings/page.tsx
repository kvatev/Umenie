import React from "react";
import { Metadata } from "next";
import { BookingsTable, BookingRecord } from "@/components/admin/BookingsTable";
import { supabaseAdmin } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Заявки за записване | Административен панел",
};

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  let bookings: BookingRecord[] = [];

  try {
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookings in admin:", error.message);
    } else if (data) {
      bookings = data as BookingRecord[];
    }
  } catch (err) {
    console.error("Bookings page exception:", err);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
          Входяща поща
        </span>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark mt-1">
          Заявки за записване
        </h1>
        <p className="text-brand-muted text-xs sm:text-sm font-sans mt-0.5">
          Преглеждайте, потвърждавайте или отказвайте получените заявки от календара.
        </p>
      </div>

      {/* Bookings Table Component */}
      <BookingsTable initialBookings={bookings} />
    </div>
  );
}
