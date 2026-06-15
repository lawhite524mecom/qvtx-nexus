import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Plus, Trash2, Clock } from "lucide-react";
import GlassCard from "../ui/GlassCard";

export default function VestingScheduleBuilder({ schedule, onScheduleChange }) {
  const [newEntry, setNewEntry] = useState({
    beneficiary: "",
    amount: "",
    releaseTime: ""
  });

  const addVestingEntry = () => {
    if (newEntry.beneficiary && newEntry.amount && newEntry.releaseTime) {
      onScheduleChange([...schedule, { ...newEntry, released: false }]);
      setNewEntry({ beneficiary: "", amount: "", releaseTime: "" });
    }
  };

  const removeEntry = (index) => {
    onScheduleChange(schedule.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold">Vesting Schedule</h3>
      </div>

      {/* Add New Entry */}
      <GlassCard padding="p-4">
        <div className="grid sm:grid-cols-3 gap-3 mb-3">
          <Input
            placeholder="Beneficiary Address"
            value={newEntry.beneficiary}
            onChange={(e) => setNewEntry({...newEntry, beneficiary: e.target.value})}
            className="bg-white/5 border-white/10"
          />
          <Input
            type="number"
            placeholder="Amount"
            value={newEntry.amount}
            onChange={(e) => setNewEntry({...newEntry, amount: e.target.value})}
            className="bg-white/5 border-white/10"
          />
          <Input
            type="datetime-local"
            value={newEntry.releaseTime}
            onChange={(e) => setNewEntry({...newEntry, releaseTime: e.target.value})}
            className="bg-white/5 border-white/10"
          />
        </div>
        <Button
          onClick={addVestingEntry}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vesting Entry
        </Button>
      </GlassCard>

      {/* Existing Entries */}
      {schedule.length > 0 && (
        <div className="space-y-2">
          {schedule.map((entry, index) => (
            <GlassCard key={index} padding="p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-white/40 text-xs">Beneficiary</p>
                    <p className="font-mono truncate">{entry.beneficiary.slice(0, 10)}...</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Amount</p>
                    <p className="font-semibold">{entry.amount}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Release</p>
                    <p className="text-xs">{new Date(entry.releaseTime).toLocaleDateString()}</p>
                  </div>
                </div>
                <Button
                  onClick={() => removeEntry(index)}
                  variant="ghost"
                  size="sm"
                  className="text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {schedule.length === 0 && (
        <p className="text-center text-white/40 text-sm py-4">
          No vesting entries yet. Add entries above.
        </p>
      )}
    </div>
  );
}