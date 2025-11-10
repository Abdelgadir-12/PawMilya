import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateAppointmentNotesInDB } from "@/utils/appointmentDB";

type Appointment = {
	id: string;
	user_notes?: string;
};

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	appointment: Appointment;
	onNotesUpdated: () => Promise<void> | void;
};

export const AppointmentNotesDialog: React.FC<Props> = ({ open, onOpenChange, appointment, onNotesUpdated }) => {
	const [notes, setNotes] = useState<string>("");
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		setNotes(appointment.user_notes || "");
	}, [appointment]);

	const handleSave = async () => {
		try {
			setSaving(true);
			await updateAppointmentNotesInDB(appointment.id, notes);
			await onNotesUpdated();
			onOpenChange(false);
		} finally {
			setSaving(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Appointment Notes</DialogTitle>
				</DialogHeader>
				<div className="space-y-3">
					<Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add your notes for this appointment..." />
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
					<Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};


