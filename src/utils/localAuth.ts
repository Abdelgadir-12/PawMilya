import { User } from "@/types/auth";

type StoredUser = User & {
	password: string;
};

const USERS_KEY = "local_users";
const SESSION_KEY = "local_session";

type SessionData = {
	userId: string;
};

export const readUsers = (): StoredUser[] => {
	try {
		const raw = localStorage.getItem(USERS_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
};

export const writeUsers = (users: StoredUser[]) => {
	localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const findUserByEmail = (email: string): StoredUser | undefined => {
	const users = readUsers();
	return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const createLocalUser = (name: string, email: string, password: string): User => {
	const users = readUsers();
	const normalizedEmail = email.trim().toLowerCase();
	if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
		throw new Error("This email is already registered. Please log in.");
	}

	const id = typeof crypto !== "undefined" && "randomUUID" in crypto
		? crypto.randomUUID()
		: `local-${Date.now()}`;

	const user: StoredUser = {
		id,
		name: name.trim(),
		email: normalizedEmail,
		role: normalizedEmail === "admin@example.com" ? "admin" : "customer",
		password,
	};

	users.push(user);
	writeUsers(users);

	return { id: user.id, name: user.name, email: user.email, role: user.role };
};

export const verifyCredentials = (email: string, password: string): User | null => {
	const match = findUserByEmail(email);
	if (!match) return null;
	if (match.password !== password) return null;
	return { id: match.id, name: match.name, email: match.email, role: match.role, phone: match.phone, address: match.address };
};

export const setLocalSession = (userId: string) => {
	const session: SessionData = { userId };
	localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearLocalSession = () => {
	localStorage.removeItem(SESSION_KEY);
};

export const getSessionUser = (): User | null => {
	try {
		const raw = localStorage.getItem(SESSION_KEY);
		if (!raw) return null;
		const session: SessionData = JSON.parse(raw);
		const users = readUsers();
		const match = users.find(u => u.id === session.userId);
		return match ? { id: match.id, name: match.name, email: match.email, role: match.role, phone: match.phone, address: match.address } : null;
	} catch {
		return null;
	}
};

export const updateStoredUser = (userId: string, updates: Partial<User>) => {
	const users = readUsers();
	const idx = users.findIndex(u => u.id === userId);
	if (idx === -1) return;
	users[idx] = { ...users[idx], ...updates } as StoredUser;
	writeUsers(users);
};


