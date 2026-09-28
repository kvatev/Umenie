"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
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
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  User,
  Heart,
} from "lucide-react";
import { updateBookingStatusAction, deleteBookingAction } from "@/actions/admin-bookings";
import { cn } from "@/lib/utils";

export interface BookingRecord {
  id: string;
  schedule_id?: string | null;
  event_id?: string | null;
  activity_name: string;
  child_name: string;
  child_age: string;
  parent_name: string;
  phone: string;
  email?: string | null;
  consent_marketing?: boolean;
  status: "pending" | "confirmed" | "cancelled" | "declined";
  created_at: string;
}

interface BookingsTableProps {
  initialBookings: BookingRecord[];
}

function getActivityImage(activityName: string): { image: string; slug: string; name: string } {
  const norm = (activityName || "").toLowerCase();
  if (norm.includes("плет")) return { image: "/images/services/pletivo.webp", slug: "pletivo", name: "Плетиво" };
  if (norm.includes("шах")) return { image: "/images/services/shah.webp", slug: "shah", name: "Шах" };
  if (norm.includes("арт") || norm.includes("рисув") || norm.includes("творч"))
    return { image: "/images/services/art.webp", slug: "art-zanimaniya", name: "Арт занимания" };
  if (norm.includes("занимал"))
    return { image: "/images/services/uchebna-zanimalnya.webp", slug: "uchebna-zanimalnya", name: "Учебна занималня" };
  if (norm.includes("чит") || norm.includes("лигериа") || norm.includes("книг"))
    return { image: "/images/services/chitatelski-klub.webp", slug: "chitatelski-klub", name: "Читателски клуб" };
  return { image: "/images/services/urotsi.webp", slug: "urotsi-i-kursove", name: "Уроци и курсове" };
}

export function BookingsTable({ initialBookings }: BookingsTableProps) {
  const [bookings, setBookings] = useState<BookingRecord[]>(initialBookings);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModalSnippet, setShowModalSnippet] = useState(true);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Filter and Search logic
  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === "pending" && b.status !== "pending") return false;
    if (filterStatus === "confirmed" && b.status !== "confirmed") return false;
    if (filterStatus === "cancelled" && b.status !== "cancelled" && b.status !== "declined") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchChild = (b.child_name || "").toLowerCase().includes(q);
      const matchParent = (b.parent_name || "").toLowerCase().includes(q);
      const matchPhone = (b.phone || "").includes(q);
      const matchActivity = (b.activity_name || "").toLowerCase().includes(q);
      return matchChild || matchParent || matchPhone || matchActivity;
    }
    return true;
  });

  const handleStatusChange = async (
    id: string,
    newStatus: "pending" | "confirmed" | "cancelled" | "declined"
  ) => {
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
  const countCancelled = bookings.filter((b) => b.status === "cancelled" || b.status === "declined").length;

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
      {/* LIVE SNIPPET PREVIEW: Как изглежда формата за записване в уебсайта */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-card border border-brand-purple/15 space-y-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowModalSnippet(!showModalSnippet)}>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-heading font-bold text-sm sm:text-base text-brand-dark">
              Отрязък на живо: Как родителите подават заявка от сайта (/grafik)
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/grafik"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-brand-purple hover:underline"
            >
              <span>Тествай формата на живо</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <button className="p-1 rounded-full hover:bg-brand-purple/10 text-brand-dark transition-colors">
              {showModalSnippet ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {showModalSnippet && (
          <div className="pt-2 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-brand-bg rounded-2xl p-4 sm:p-6 border border-brand-purple/20 shadow-inner items-center">
              {/* Left explanation */}
              <div className="md:col-span-6 space-y-3">
                <span className="text-[11px] font-bold text-brand-purple uppercase tracking-wider bg-brand-purple/10 px-2.5 py-0.5 rounded-full">
                  Процес на записване
                </span>
                <h4 className="font-heading font-black text-lg text-brand-dark">
                  Родителите избират час от графика и попълват контактните си данни
                </h4>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Всяка заявка от публичния календар влиза незабавно тук със статус <strong>„Чакаща“</strong>. От тази таблица можете с 1 клик да наберете родителя от мобилния си телефон или да му изпратите имейл.
                </p>
                <div className="flex items-center gap-4 text-xs font-bold text-brand-dark">
                  <div className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Потвърждаване с 1 клик</span>
                  </div>
                  <div className="flex items-center gap-1 text-brand-purple">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Директно обаждане</span>
                  </div>
                </div>
              </div>

              {/* Right: Realistic mini mockup of the modal */}
              <div className="md:col-span-6">
                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-card border border-brand-purple/20 max-w-sm mx-auto space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-brand-purple/10">
                    <div className="flex items-center gap-2">
                      <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-brand-bg">
                        <Image src="/images/services/pletivo.webp" alt="Занимание" fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-brand-purple leading-none">Записване за час</p>
                        <p className="font-heading font-bold text-xs text-brand-dark">Плетиво и творчество</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Вторник 18:00
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="p-2 rounded-xl bg-brand-bg/80 flex items-center justify-between text-brand-muted">
                      <span>Име на дете:</span>
                      <strong className="text-brand-dark">Симона (8г.)</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-brand-bg/80 flex items-center justify-between text-brand-muted">
                      <span>Родител:</span>
                      <strong className="text-brand-dark">Елена Иванова</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-brand-bg/80 flex items-center justify-between text-brand-muted">
                      <span>Телефон:</span>
                      <strong className="text-brand-purple font-mono">0888 123 456</strong>
                    </div>
                  </div>

                  <div className="w-full py-2 rounded-xl bg-brand-purple text-white text-center font-heading font-bold text-xs shadow-button">
                    Изпрати заявката →
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-card border border-brand-purple/15 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: "all", label: "Всички", count: countAll },
            { id: "pending", label: "Чакащи", count: countPending, color: "text-amber-700 bg-amber-100" },
            { id: "confirmed", label: "Потвърдени", count: countConfirmed, color: "text-emerald-700 bg-emerald-100" },
            { id: "cancelled", label: "Отказани", count: countCancelled, color: "text-red-700 bg-red-100" },
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
                <th className="py-4 px-4">Занимание / Снимка</th>
                <th className="py-4 px-4">Дете</th>
                <th className="py-4 px-4">Възраст</th>
                <th className="py-4 px-4">Родител</th>
                <th className="py-4 px-4">Телефон (директно)</th>
                <th className="py-4 px-4">Дата</th>
                <th className="py-4 px-4 text-center">Маркетинг</th>
                <th className="py-4 px-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-purple/10 text-xs sm:text-sm">
              {filteredBookings.map((b) => {
                const isWorking = activeActionId === b.id && isPending;
                const act = getActivityImage(b.activity_name);

                return (
                  <tr key={b.id} className="hover:bg-brand-bg/60 transition-colors group">
                    {/* Status badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
                          b.status === "confirmed"
                            ? "bg-emerald-100 text-emerald-800"
                            : b.status === "cancelled" || b.status === "declined"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        )}
                      >
                        {b.status === "confirmed" && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {(b.status === "cancelled" || b.status === "declined") && <XCircle className="w-3.5 h-3.5" />}
                        {b.status === "pending" && <Clock className="w-3.5 h-3.5" />}
                        <span>
                          {b.status === "confirmed"
                            ? "Потвърдена"
                            : b.status === "cancelled" || b.status === "declined"
                            ? "Отказана"
                            : "Чакаща"}
                        </span>
                      </span>
                    </td>

                    {/* Activity with Image Preview */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-brand-bg border border-brand-purple/20 shrink-0 shadow-sm">
                          <Image src={act.image} alt={b.activity_name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-brand-dark group-hover:text-brand-purple transition-colors">
                            {b.activity_name}
                          </p>
                          <span className="text-[10px] text-brand-muted">{act.name}</span>
                        </div>
                      </div>
                    </td>

                    {/* Child Name */}
                    <td className="py-4 px-4 font-bold text-brand-dark">{b.child_name}</td>

                    {/* Child Age */}
                    <td className="py-4 px-4 text-brand-muted">{b.child_age}</td>

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
                              title="Потвърди заявката (Confirmed)"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}

                          {b.status !== "cancelled" && b.status !== "declined" && (
                            <button
                              onClick={() => handleStatusChange(b.id, "cancelled")}
                              className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                              title="Откажи / Анулирай (Cancelled)"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}

                          {b.status !== "pending" && (
                            <button
                              onClick={() => handleStatusChange(b.id, "pending")}
                              className="p-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-colors cursor-pointer"
                              title="Върни в чакащи (Pending)"
                            >
                              <Clock className="w-4 h-4" />
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
          const act = getActivityImage(b.activity_name);

          return (
            <div
              key={b.id}
              className="bg-white p-5 rounded-3xl shadow-card border border-brand-purple/15 space-y-3"
            >
              {/* Card Header: Activity with Photo + Status */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-brand-bg border border-brand-purple/20 shrink-0">
                    <Image src={act.image} alt={b.activity_name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-brand-dark">
                      {b.activity_name}
                    </h4>
                    <span className="text-[10px] text-brand-muted">{formatDate(b.created_at)}</span>
                  </div>
                </div>

                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0",
                    b.status === "confirmed"
                      ? "bg-emerald-100 text-emerald-800"
                      : b.status === "cancelled" || b.status === "declined"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  )}
                >
                  {b.status === "confirmed" && <CheckCircle2 className="w-3 h-3" />}
                  {(b.status === "cancelled" || b.status === "declined") && <XCircle className="w-3 h-3" />}
                  {b.status === "pending" && <Clock className="w-3 h-3" />}
                  <span>
                    {b.status === "confirmed"
                      ? "Потвърдена"
                      : b.status === "cancelled" || b.status === "declined"
                      ? "Отказана"
                      : "Чакаща"}
                  </span>
                </span>
              </div>

              {/* Child & Parent Details */}
              <div className="bg-brand-bg p-3.5 rounded-2xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-brand-muted">Дете:</span>
                  <span className="font-bold text-brand-dark">
                    {b.child_name} ({b.child_age})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-brand-muted">Родител:</span>
                  <span className="font-semibold text-brand-dark">{b.parent_name}</span>
                </div>
              </div>

              {/* Direct Phone Call Button */}
              <a
                href={`tel:${b.phone}`}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white font-heading font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Обади се: {b.phone}</span>
              </a>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-brand-purple/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {b.status !== "confirmed" && (
                    <button
                      onClick={() => handleStatusChange(b.id, "confirmed")}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                      title="Потвърди"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Потвърди</span>
                    </button>
                  )}

                  {b.status !== "cancelled" && b.status !== "declined" && (
                    <button
                      onClick={() => handleStatusChange(b.id, "cancelled")}
                      className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-600 hover:text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                      title="Откажи"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Откажи</span>
                    </button>
                  )}

                  {b.status !== "pending" && (
                    <button
                      onClick={() => handleStatusChange(b.id, "pending")}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                      title="Върни в чакащи"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Чакаща</span>
                    </button>
                  )}
                </div>

                {isWorking ? (
                  <Loader2 className="w-4 h-4 animate-spin text-brand-purple" />
                ) : (
                  <button
                    onClick={() => handleDelete(b.id, b.child_name)}
                    className="p-2 rounded-xl text-brand-muted hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
                    title="Изтрий"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
              Всички нови заявки ще се покажат тук.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
