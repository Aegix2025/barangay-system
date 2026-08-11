import React from 'react';
import {
  Award,
  Mail,
  Phone,
  Calendar,
  UserCheck,
  Crown,
  Users,
} from 'lucide-react';

import { BarangayOfficial } from '../types';

interface Props {
  officials: BarangayOfficial[];
}

export const Officials: React.FC<Props> = ({ officials }) => {
  const captain = officials.find(
    (o) => o.position === 'Barangay Captain'
  );

  const secretary = officials.find(
    (o) => o.position === 'Barangay Secretary'
  );

  const treasurer = officials.find(
    (o) => o.position === 'Barangay Treasurer'
  );

  const skChair = officials.find(
    (o) => o.position === 'SK Chairman'
  );

  const kagawads = officials.filter(
    (o) => o.position === 'Barangay Kagawad'
  );

  // ==========================================
  // OFFICIAL AVATAR
  // ==========================================
  const OfficialAvatar = ({
    name,
    size = 'md',
    isCaptain = false,
  }: {
    name: string;
    size?: 'sm' | 'md' | 'lg';
    isCaptain?: boolean;
  }) => {
    const sizeClasses = {
      sm: 'w-[95px] h-[95px]',
      md: 'w-[100px] h-[100px]',
      lg: 'w-[130px] h-[130px]',
    };

    return (
      <div
        className={`
          ${sizeClasses[size]}
          shrink-0
          rounded-full
          overflow-hidden
          flex
          items-center
          justify-center
          border-[0.5px]
          border-gray-50
          relative
          -left-10
        `}
      >
        {isCaptain ? (
          <img
            src="/barangay-logo.png"
            alt={`${name} - Barangay Captain`}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            <Users className="w-1/2 h-1/2 text-indigo-500" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">

      {/* ==========================================
          HEADER BANNER
      ========================================== */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm -mt-4">
        <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
          <Award className="w-6 h-6 text-indigo-400" />

          <span>
            Barangay SF II Officials (2026)
          </span>
        </h2>

        <p className="text-xs text-gray-700 mt-1">
          Barangay SF II, Nestor Nabaunag, Limay, Bataan •
          Barangay Council Directory
        </p>
      </div>


      {/* ==========================================
          BARANGAY CAPTAIN
      ========================================== */}
      {captain && (
        <div className="
          bg-white
          border
          border-gray-200
          rounded-2xl
          p-3
          text-gray-800
          flex
          flex-col
          md:flex-row
          items-center
          gap-5
          shadow-sm
          relative
          -top-2
        ">

          {/* Captain Information */}
          <div className="flex-grow space-y-2 text-center md:text-left relative left-4">

            {/* Position */}
            <div className="
              inline-flex
              items-center
              gap-1.5
              bg-amber-50
              text-amber-700
              border
              border-amber-200
              px-3
              py-1
              rounded-full
              text-xs
              font-bold
              uppercase
              tracking-wider
              relative
              top-1
            ">
              <Crown className="w-3 h-3" />

              <span>
                {captain.position}
              </span>
            </div>

            {/* Name */}
            <h3 className="relative -top-0.5 text-2xl font-bold text-gray-700">
              {captain.full_name}
            </h3>

            {/* Description */}
            <p className="relative -top-1 text-xs text-gray-600 max-w-xl">
              Punong Barangay ng SF II, Nestor Nabaunag,
              Limay, Bataan • Head of Executive & Peace and
              Order Committee
            </p>

            {/* Contact Information */}
            <div className="
              flex
              flex-wrap
              items-center
              justify-center
              md:justify-start
              gap-4
              text-xs
              text-gray-700
              pt-2
              relative -top-1
            ">

              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                {captain.contact_number}
              </span>

              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                {captain.email}
              </span>

              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Term: 2023 – 2026
              </span>
            </div>
          </div>
          {/* Captain Logo */}
          <OfficialAvatar
            name={captain.full_name}
            size="lg"
            isCaptain={true}
          />
        </div>
      )}
      {/* ==========================================
          APPOINTED OFFICIALS
      ========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[secretary, treasurer, skChair].map((off) => {
          if (!off) return null;
          return (
            <div
              key={off.official_id}
              className="
                bg-white
                p-5
                rounded-2xl
                border
                border-gray-200
                flex
                items-start
                gap-4
                hover:shadow-md
                transition-shadow
                relative
                -mt-4
              "
            >
              {/* Information */}
              <div className="flex-1 min-w-0">
                {/* Position */}
                <span className="
                  inline-block
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-gray-700
                  bg-indigo-200
                  px-2
                  py-0.5
                  rounded-xl
                  relative
                  -top-2
                ">
                  {off.position}
                </span>

                {/* Name */}
                <h4 className="
                  font-bold
                  text-base
                  text-gray-700
                  relative
                  -top-1
                ">
                  {off.full_name}
                </h4>

                {/* Committee */}
                <p className="text-xs text-gray-600 mt-0.5">
                  {off.committee || '—'}
                </p>

                {/* Contact */}
                <div className="
                  text-xs
                  text-gray-700
                  pt-2
                  border-gray-200
                  mt-2
                  space-y-1
                ">
                  <p className="relative -top-1 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />

                    <span className="truncate">
                      {off.contact_number}
                    </span>
                  </p>
                  <p className="relative top-1 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />

                    <span className="truncate">
                      {off.email}
                    </span>
                  </p>
                </div>
              </div>

              {/* Avatar */}
              <OfficialAvatar
                name={off.full_name}
                size="sm"
                isCaptain={false}
              />
            </div>
          );
        })}
      </div>

      {/* ==========================================
          BARANGAY KAGAWAD
      ========================================== */}
      <div className="space-y-3">
        {/* Section Title */}
        <h3 className="
          text-base
          font-bold
          text-gray-700
          flex
          items-center
          gap-2
          -mt-3
        ">
          <UserCheck className="w-5 h-5 text-indigo-400" />
          <span>
            Barangay Kagawad (7 Members)
          </span>
        </h3>

        {/* Kagawad Grid */}
        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-4
        ">
          {kagawads.map((k) => (
            <div
              key={k.official_id}
              className="
                bg-white
                p-5
                rounded-2xl
                border
                border-gray-200
                hover:border-indigo-200
                hover:shadow-md
                transition-all
                flex
                items-start
                gap-4
              "
            >
              {/* Information */}
              <div className="flex-1 min-w-0">
                {/* Committee */}
                <span className="
                  inline-block
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-gray-700
                  bg-indigo-200
                  px-2
                  py-0.5
                  rounded-xl
                  relative
                  -top-2
                ">
                  {k.committee || 'Member'}
                </span>

                {/* Name */}
                <h4 className="
                  font-bold
                  text-base
                  text-gray-700
                  relative
                  -top-1
                ">
                  {k.full_name}
                </h4>


                {/* Position */}
                <p className="
                  text-xs
                  text-gray-600
                  font-semibold
                  mt-0.5
                ">
                  {k.position}
                </p>


                {/* Contact Information */}
                <div className="
                  text-xs
                  text-gray-700
                  pt-2
                  border-gray-200
                  mt-2
                  space-y-1
                ">

                  <p className="relative -top-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />

                    <span className="truncate">
                      {k.contact_number}
                    </span>
                  </p>

                  <p className="relative top-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />

                    <span className="truncate">
                      {k.email}
                    </span>
                  </p>

                </div>

              </div>


              {/* Avatar */}
              <OfficialAvatar
                name={k.full_name}
                size="sm"
                isCaptain={false}
              />

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};