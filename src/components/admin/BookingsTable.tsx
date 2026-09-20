"use client";

import React, { useState, useTransition } from "react";
import {
  Check,
  X,
  Trash2,
  Phone,
  Mail,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Calendar,
} from "lucide-react";
import { updateBookingStatusAction, deleteBookingAction } from "@/actions/admin-bookings";
import { cn } from "@/lib/utils";

export interface BookingRecord {
  id: string;
  schedule_id?: string | null;
  activity_name: string;
  child_name: string;
  child_age: string;
  parent_name: string;
  phone: string;
  email?: string | null;
  consent_marketing: boolean;
  status: "pending" | "confirmed" | "declined";
  created_at: string;
}

interface BookingsTableProps {
  initialBookings: BookingRecord[];
}

export function BookingsTable({ initialBookings }: BookingsTableProps) {
  const [bookings, setBookings] = useState<BookingRecord[]>(initialBookings);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Filter and Search logic
  const filteredBookings = bookings.filter((b) => {
    if (filterStatus !== "all" && b.status !== filterStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchChild = b.child_name.toLowerCase().includes(q);
      const matchParent = b.parent_name.toLowerCase().includes(q);
      const matchPhone = b.phone.includes(q);
      const matchActivity = b.activity_name.toLowerCase().includes(q);
      return matchChild || matchParent || matchPhone || matchActivity;
    }
    return true;
  });

  const handleStatusChange = async (id: string, newStatus: "pending" | "confirmed" | "declined") => {
    setActiveActionId(id);
    startTransition(async () => {
      // Optimistic update
      setBookings((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );

      const res = await updateBookingStatusAction(id, newStatus);
      if (!res.success) {
        alert(res.message || "Грешка при промяна на статуса.");
      }
      setActiveActionId(null);
    });
  };

  const handleDelete = async (id: string, childName: string) => {
    if (!window.confirm(`Сигурни ли сте, че искате да изтриете заявката за ${childName}?`)) {
      return;
    }

    setActiveActionId(id);
    startTransition(async () => {
      // Optimistic update
      setBookings((prev) => prev.filter((item) => item.id !== id));

      const res = await deleteBookingAction(id);
      if (!res.success) {
        alert(res.message || "Грешка при изтриване.");
      }
      setActiveActionId(null);
    });
  };

  // Counts for tabs
  const countAll = bookings.length;
  const countPending = bookings.filter((b) => b.status === "pending").length;
  const countConfirmed = bookings.filter((b) => b.status === "confirmed").length;
  const countDeclined = bookings.filter((b) => b.status === "declined").length;

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat("bg-BG", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-card border border-brand-purple/15 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: "all", label: "Всички", count: countAll },
            { id: "pending", label: "Чакащи", count: countPending, color: "text-amber-700 bg-amber-100" },
            { id: "confirmed", label: "Потвърдени", count: countConfirmed, color: "text-emerald-700 bg-emerald-100" },
            { id: "declined", label: "Отказани", count: countDeclined, color: "text-red-700 bg-red-100" },
          ].map((tab) => {
            const isSelected = filterStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-2xl font-heading text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer",
                  isSelected
                    ? "bg-brand-purple text-white shadow-button"
                    : "bg-brand-bg text-brand-dark/80 hover:bg-brand-purple/10"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                    isSelected ? "bg-white text-brand-purple" : tab.color || "bg-brand-purple/15 text-brand-purple"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
            <Search className="w-4 h-4 text-brand-purple/70" />
          </div>
          <input
            type="text"
            placeholder="Търси по име, тел, занятие..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-brand-bg text-xs sm:text-sm text-brand-dark border border-brand-purple/20 focus:outline-none focus:ring-2 focus:ring-brand-purple transition-all"
          />
        </div>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block bg-white rounded-3xl shadow-card border border-brand-purple/15 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-purple/15 bg-brand-purple/5 text-[11px] font-heading font-bold text-brand-purple uppercase tracking-wider">
                <th className="py-4 px-4">Статус</th>
                <th className="py-4 px-4">Дете</th>
                <th className="py-4 px-4">Възраст</th>
                <th className="py-4 px-4">Родител</th>
                <th className="py-4 px-4">Телефон (директно)</th>
                <th className="py-4 px-4">Занимание</th>
                <th className="py-4 px-4">Дата</th>
                <th className="py-4 px-4 text-center">Маркетинг</th>
                <th className="py-4 px-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-purple/10 text-xs sm:text-sm">
              {filteredBookings.map((b) => {
                const isWorking = activeActionId === b.id && isPending;

                return (
                  <tr
                    key={b.id}
                    className="hover:bg-brand-bg/60 transition-colors group"
                  >
                    {/* Status badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
                          b.status === "confirmed"
                            ? "bg-emerald-100 text-emerald-800"
                            : b.status === "declined"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        )}
                      >
                        {b.status === "confirmed" && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {b.status === "declined" && <XCircle className="w-3.5 h-3.5" />}
                        {b.status === "pending" && <Clock className="w-3.5 h-3.5" />}
                        <span>
                          {b.status === "confirmed"
                            ? "Потвърдена"
                            : b.status === "declined"
                            ? "Отказана"
                            : "Чакаща"}
                        </span>
                      </span>
                    </td>

                    {/* Child Name */}
                    <td className="py-4 px-4 font-bold text-brand-dark">
                      {b.child_name}
                    </td>

                    {/* Child Age */}
                    <td className="py-4 px-4 text-brand-muted">
                      {b.child_age}
                    </td>

                    {/* Parent Name */}
                    <td className="py-4 px-4 text-brand-dark">
                      <div className="font-semibold">{b.parent_name}</div>
                      {b.email && (
                        <a
                          href={`mailto:${b.email}`}
                          className="text-[11px] text-brand-purple hover:underline inline-flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          <span>{b.email}</span>
                        </a>
                      )}
                    </td>

                    {/* Phone with tel: link */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <a
                        href={`tel:${b.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white font-heading font-bold text-xs transition-all shadow-sm"
                        title="Натиснете за обаждане"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{b.phone}</span>
                      </a>
                    </td>

                    {/* Activity */}
                    <td className="py-4 px-4 font-bold text-brand-purple">
                      {b.activity_name}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-brand-muted text-xs whitespace-nowrap">
                      {formatDate(b.created_at)}
                    </td>

                    {/* Marketing Consent */}
                    <td className="py-4 px-4 text-center">
                      {b.consent_marketing ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          Да
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                          Не
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      {isWorking ? (
                        <Loader2 className="w-5 h-5 animate-spin text-brand-purple inline-block" />
                      ) : (
                        <div className="inline-flex items-center gap-1.5">
                          {b.status !== "confirmed" && (
                            <button
                              onClick={() => handleStatusChange(b.id, "confirmed")}
                              className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                              title="Потвърди заявката"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}

                          {b.status !== "declined" && (
                            <button
                              onClick={() => handleStatusChange(b.id, "declined")}
                              className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                              title="Откажи заявката"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(b.id, b.child_name)}
                            className="p-2 rounded-xl text-brand-muted hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
                            title="Изтрий от списъка"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="py-16 text-center space-y-2">
            <p className="text-brand-dark font-heading font-bold text-base">
              Няма намерени заявки
            </p>
            <p className="text-xs text-brand-muted max-w-sm mx-auto">
              {searchQuery
                ? `Няма резултати за „${searchQuery}“ в избрания филтър.`
                : "В момента няма получени заявки в тази категория."}
            </p>
          </div>
        )}
      </div>

      {/* MOBILE CARDS VIEW */}
      <div className="lg:hidden space-y-4">
        {filteredBookings.map((b) => {
          const isWorking = activeActionId === b.id && isPending;

          return (
            <div
              key={b.id}
              className="bg-white p-5 rounded-3xl shadow-card border border-brand-purple/15 space-y-3"
            >
              {/* Card Header: Status + Date */}
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold",
                    b.status === "confirmed"
                      ? "bg-emerald-100 text-emerald-800"
                      : b.status === "declined"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  )}
                >
                  <span>
                    {b.status === "confirmed"
                      ? "Потвърдена"
                      : b.status === "declined"
                      ? "Отказана"
                      : "Чакаща"}
                  </span>
                </span>

                <span className="text-[11px] text-brand-muted flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(b.created_at)}
                </span>
              </div>

              {/* Child and Activity */}
              <div>
                <h3 className="font-heading font-bold text-base text-brand-dark">
                  {b.child_name} <span className="text-xs font-normal text-brand-muted">({b.child_age})</span>
                </h3>
                <p className="text-xs font-semibold text-brand-purple mt-0.5">
                  {b.activity_name}
                </p>
              </div>

              {/* Parent info */}
              <div className="pt-2 border-t border-brand-purple/10 text-xs space-y-1">
                <p className="text-brand-dark/80">
                  <span className="font-bold">Родител:</span> {b.parent_name}
                </p>
                {b.email && (
                  <p className="text-brand-muted">
                    <span className="font-bold">Имейл:</span> {b.email}
                  </p>
                )}
                <p className="text-brand-muted text-[11px]">
                  <span className="font-bold">Маркетинг:</span> {b.consent_marketing ? "Да" : "Не"}
                </p>
              </div>

              {/* Actions & Call Phone */}
              <div className="pt-3 border-t border-brand-purple/10 flex items-center justify-between gap-2">
                <a
                  href={`tel:${b.phone}`}
                  className="flex-1 py-2 px-3 rounded-2xl bg-brand-purple text-white text-xs font-bold flex items-center justify-center gap-2 shadow-button"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{b.phone}</span>
                </a>

                {isWorking ? (
                  <Loader2 className="w-5 h-5 animate-spin text-brand-purple" />
                ) : (
                  <div className="flex items-center gap-1.5">
                    {b.status !== "confirmed" && (
                      <button
                        onClick={() => handleStatusChange(b.id, "confirmed")}
                        className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
                        title="Потвърди"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}

                    {b.status !== "declined" && (
                      <button
                        onClick={() => handleStatusChange(b.id, "declined")}
                        className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                        title="Откажи"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(b.id, b.child_name)}
                      className="p-2 rounded-xl text-brand-muted hover:bg-red-100 hover:text-red-700 transition-colors"
                      title="Изтрий"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredBookings.length === 0 && (
          <div className="bg-white rounded-3xl p-8 text-center space-y-2 border border-brand-purple/15">
            <p className="text-brand-dark font-heading font-bold text-sm">
              Няма намерени заявки
            </p>
            <p className="text-xs text-brand-muted">
              {searchQuery ? "Няма съвпадения с въведената дума." : "Списъкът е празен."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
