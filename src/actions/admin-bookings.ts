"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function updateBookingStatusAction(
  bookingId: string,
  newStatus: "pending" | "confirmed" | "cancelled" | "declined"
) {
  try {
    const { error } = await supabaseAdmin
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", bookingId);

    if (error) {
      console.error("Error updating booking status:", error.message);
      return { success: false, message: error.message };
    }

    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
    revalidatePath("/grafik");
    revalidatePath("/");
    revalidatePath("/za-nas");
    revalidatePath("/uslugi");

    return { success: true, message: "Статусът е актуализиран успешно!" };
  } catch (err: unknown) {
    console.error("Booking status action error:", err);
    return { success: false, message: "Възникна грешка при обновяване." };
  }
}

export async function deleteBookingAction(bookingId: string) {
  try {
    const { error } = await supabaseAdmin
      .from("bookings")
      .delete()
      .eq("id", bookingId);

    if (error) {
      console.error("Error deleting booking:", error.message);
      return { success: false, message: error.message };
    }

    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
    revalidatePath("/grafik");
    revalidatePath("/");
    revalidatePath("/za-nas");
    revalidatePath("/uslugi");

    return { success: true, message: "Заявката е изтрита успешно!" };
  } catch (err: unknown) {
    console.error("Delete booking action error:", err);
    return { success: false, message: "Възникна грешка при изтриване." };
  }
}
