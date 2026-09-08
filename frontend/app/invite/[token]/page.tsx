"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { InvitationService } from "@/services/invitation.service";
import { InvitationResponse, GuestData } from "@/types/invitation";
import { HeroEnvelope } from "@/components/invitation/HeroEnvelope";
import { PersonalizedGreeting } from "@/components/invitation/PersonalizedGreeting";
import { EventDetails } from "@/components/invitation/EventDetails";
import { CountdownTimer } from "@/components/invitation/CountdownTimer";
import { TimelineSection } from "@/components/invitation/TimelineSection";
import { GalleryMasonry } from "@/components/invitation/GalleryMasonry";
import { RSVPSection } from "@/components/invitation/RSVPSection";
import { WishesWall } from "@/components/invitation/WishesWall";
import { ClosingNote } from "@/components/invitation/ClosingNote";
import { FloatingParticles } from "@/components/invitation/FloatingParticles";
import { AudioPlayer } from "@/components/invitation/AudioPlayer";
import { useAudio } from "@/hooks/useAudio";
import { AlertCircle, GraduationCap, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function InvitationPage() {
  const params = useParams();
  const token = params?.token as string;

  const [invitationData, setInvitationData] =
    useState<InvitationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);

  // Background Audio Hook
  const { isPlaying, play, toggle } = useAudio(
    invitationData?.event.backgroundMusic,
  );

  useEffect(() => {
    if (!token) return;

    const fetchInvitation = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const data = await InvitationService.getInvitation(token);
        setInvitationData(data);
      } catch (err: any) {
        setErrorMsg(
          err.message || "Thiệp mời không tồn tại hoặc đường dẫn không hợp lệ.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [token]);

  const handleEnvelopeOpen = () => {
    setIsEnvelopeOpen(true);
    // Try to trigger smooth audio playback on user action
    play();
  };

  const handleRsvpSuccess = (updatedGuest: GuestData) => {
    if (invitationData) {
      setInvitationData({
        ...invitationData,
        guest: updatedGuest,
      });
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-4 text-cream-50">
        <div className="w-16 h-16 rounded-full border-4 border-champagne-500/20 border-t-champagne-400 animate-spin mb-6" />
        <p className=" text-lg text-champagne-300 tracking-wider animate-pulse">
          Đang mở thiệp mời...
        </p>
      </div>
    );
  }

  // Error / Invalid Token State
  if (errorMsg || !invitationData) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#162238] border border-rose-500/30 rounded-3xl p-8 text-center text-cream-50 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-rose-400">
            <AlertCircle className="w-7 h-7" />
          </div>

          <h2 className=" text-2xl font-bold text-rose-300 mb-2">
            Không Tìm Thấy Thiệp Mời
          </h2>

          <p className="text-slate-300 text-sm font-light leading-relaxed mb-6">
            {errorMsg || "Thiệp mời không tồn tại hoặc đường dẫn không hợp lệ."}
          </p>

          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-champagne-600 hover:bg-champagne-700 text-white font-medium text-sm transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Về Trang Chủ Demo</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { event, guest } = invitationData;

  return (
    <div className="min-h-screen bg-cream-50 text-slate-900 relative selection:bg-champagne-400 selection:text-navy-950 overflow-x-hidden">
      {/* Subtle Floating Gold Particles */}
      <FloatingParticles count={20} />

      {/* Hero Envelope Overlay (Initial Screen) */}
      <HeroEnvelope
        event={event}
        guest={guest}
        isOpen={isEnvelopeOpen}
        onOpen={handleEnvelopeOpen}
      />

      {/* Main Invitation Content (Revealed after opening) */}
      {isEnvelopeOpen && (
        <div className="relative z-10 animate-fade-in">
          {/* Top Banner / Hero Cover */}
          <header className="relative h-64 md:h-96 w-full overflow-hidden bg-navy-950 flex items-center justify-center text-center">
            {event.coverImage ? (
              <img
                src={event.coverImage}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover opacity-35"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 opacity-90" />
            )}

            <div className="relative z-10 px-4 max-w-3xl">
              <span className="inline-block text-xs uppercase tracking-[0.35em] text-champagne-400 font-semibold mb-2">
                GRADUATION CEREMONY
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-cream-50 uppercase tracking-wide leading-tight">
                {event.graduateName}
              </h1>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-300 mt-2 font-sans">
                Class of 2026 &bull; Đại học Giao Thông Vận Tải phân hiệu TP.HCM
              </p>
            </div>
          </header>

          {/* Section 1: Personalized Greeting */}
          <PersonalizedGreeting event={event} guest={guest} />

          {/* Section 2: Event Details (Date, Time, Venue, Maps) */}
          <EventDetails event={event} />

          {/* Section 3: Live Countdown Timer */}
          <CountdownTimer targetDate={event.eventDate} />

          {/* Section 4: Event Timeline */}
          {event.timelines && event.timelines.length > 0 && (
            <TimelineSection timelines={event.timelines} />
          )}

          {/* Section 6: RSVP Confirmation Form */}
          <RSVPSection
            token={token}
            guest={guest}
            graduateName={event.graduateName}
            onRsvpSuccess={handleRsvpSuccess}
          />

          {/* Section 7: Wishes Guestbook Wall */}
          <WishesWall
            token={token}
            initialMessages={event.messages || []}
            defaultGuestName={guest.name}
            graduateName={event.graduateName}
          />

          {/* Section 5: Photo Memories Gallery */}
          {event.galleries && event.galleries.length > 0 && (
            <GalleryMasonry galleries={event.galleries} />
          )}

          {/* Section 8: Closing Note */}
          <ClosingNote event={event} guest={guest} />

          {/* Floating Background Music Player */}
          <AudioPlayer
            isPlaying={isPlaying}
            onToggle={toggle}
            hasMusic={Boolean(event.backgroundMusic)}
          />
        </div>
      )}
    </div>
  );
}
