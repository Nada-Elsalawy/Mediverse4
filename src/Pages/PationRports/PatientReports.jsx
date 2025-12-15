import React from "react";
import { Button, Input, Card } from "@heroui/react";
import { FiShare2 } from "react-icons/fi";
import { AiOutlineFilePdf } from "react-icons/ai";
import { IoArrowBackOutline } from "react-icons/io5";
const reports = [
  {
    title: "Pet Scan Results",
    department: "Radiology Department",
    date: "October 15, 2025",
    doctor: "Dr. saad tamer",
  },
  {
    title: "Completed blood count",
    department: "Laboratory Department",
    date: "September 15, 2025",
    doctor: "Dr. Eman salama",
  },
  {
    title: "Biopsy Analysis",
    department: "Pathology Department",
    date: "Desamber 5, 2025",
    doctor: "Dr.Mona abdelwahed",
  },
  {
    title: "Oncology consultation",
    department: "Oncology Department",
    date: "Desamber 5, 2025",
    doctor: "Dr.Mahmoud khalid",
  },
];

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-[#EFF6FC] py-10 flex justify-center">
      <div className="w-full max-w-4xl space-y-6 px-4">
        {/* Back Button */}
        <div className="flex items-center gap-2 text-azraq-400 mb-2 mt-6 cursor-pointer hover:text-[#0c3d91] transition">
          <IoArrowBackOutline className="text-lg" />
          <span className="text-sm font-normal">back</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#113c75]">Report & Scan</h1>
          <p className="text-gray-600">
            View, manage, and download all your medical reports.
          </p>
        </div>

        {/* Search + Actions Row */}
        <div className="flex items-center gap-3 flex-wrap justify-between">
          <Input
            placeholder="search reports"
            radius="lg"
            className="bg-[#e9f1fa] border border-[#cfd9ee] text-gray-700 w-[300px] h-11 shadow-sm placeholder:text-gray-500"
          />
          <div className="flex items-center gap-3">
            <Button className="bg-azraq-500 text-white font-semibold rounded-lg shadow-sm px-5 py-2 h-11 hover:bg-[#407aad]">
              ⎙ Print selected
            </Button>
            <Button className="bg-azraq-400 text-white font-semibold rounded-lg shadow-sm px-5 py-2 h-11 hover:bg-[#1b386f]">
              ⬇ Download selected
            </Button>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {reports.map((r, i) => (
            <Card
              key={i}
              className="bg-[#cfe2fc] border border-[#bcd4f5] rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-center p-4 flex-wrap gap-10">
                {/* Left Section */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  <AiOutlineFilePdf className="text-3xl text-[#113c75]" />
                  <div>
                    <h3 className="font-semibold text-[#113c75] text-[15px]">
                      {r.title}
                    </h3>
                    <p className="text-sm text-gray-700">{r.department}</p>
                  </div>
                </div>

                {/* Date + Doctor Section */}
                <div className="flex flex-col items-end min-w-[250px]">
                  <div className="flex items-center gap-[60px] justify-end">
                    <p className="text-sm font-semibold text-[#113c75] whitespace-nowrap">
                      {r.date}
                    </p>
                    <p className="text-sm font-semibold text-[#113c75] whitespace-nowrap">
                      {r.doctor}
                    </p>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 w-full mt-1">
                    <p>Date Issued</p>
                    <p>Requesting Physician</p>
                  </div>
                </div>

                {/* Share Icon */}
                <div className="flex items-center justify-center min-w-10">
                  <button className="text-[#004aad] hover:text-[#113c75] text-xl">
                    <FiShare2 />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}