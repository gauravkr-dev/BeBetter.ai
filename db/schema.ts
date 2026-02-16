import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, integer, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

// User table definition
export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const session = pgTable(
    "session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
    "account",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
    "verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

// Agent table definition 

export const agents = pgTable("agents", {
    id: text("id")
        .primaryKey()
        .$default(() => nanoid()),
    name: text("name").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    instructions: text("instructions").notNull(),
    experience: text("experience"),
    durationMinutes: integer("duration_minutes").notNull(),
    isInterviewCompleted: boolean("is_interview_completed").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});


export const speakerEnum = pgEnum("speaker", [
    "user",
    "agent",
]);

export const sessionTranscripts = pgTable("session_transcripts", {
    id: text("id")
        .primaryKey()
        .$default(() => nanoid()),

    agentId: text("agent_id")
        .notNull()
        .references(() => agents.id, { onDelete: "cascade" }),
    speaker: speakerEnum("speaker").notNull(),

    text: text("text").notNull(),

    /**
     * Sequence maintains correct order
     * helpful when timestamps are close
     */
    sequence: integer("sequence").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const interviewFeedback = pgTable("interview_feedback", {
    id: text("id")
        .primaryKey()
        .$default(() => nanoid()),

    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    agentId: text("agent_id")
        .notNull()
        .references(() => agents.id, { onDelete: "cascade" }),
    overallFeedback: text("overall_feedback"),     // 👈 summary

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const chat = pgTable("chat", {
    id: text("id")
        .primaryKey()
        .$default(() => nanoid()),

    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),

    title: text("title"), // optional (AI generate kar sakta hai)

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const chatMessage = pgTable("chat_message", {
    id: text("id")
        .primaryKey()
        .$default(() => nanoid()),

    chatId: text("chat_id")
        .notNull()
        .references(() => chat.id, { onDelete: "cascade" }),

    speaker: speakerEnum("speaker").notNull(), // user | ai | system

    text: text("text").notNull(),

    sequence: integer("sequence").notNull(), // per chat order

    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ResumeFeedbackType = {
    overall_score: number
    overall_feedback: string
    summary_comment: string
    sections: {
        contact_info: { score: number; comment: string }
        experience: { score: number; comment: string }
        education: { score: number; comment: string }
        skills: { score: number; comment: string }
    }
    tips_for_improvement: string[]
    whats_good: string[]
    needs_improvement: string[]
}

export const resumeFeedback = pgTable("resume_feedback", {
    id: text("id")
        .primaryKey()
        .$default(() => nanoid()),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    resumeUrl: text("resume_url").notNull(),
    feedback: jsonb("feedback").$type<ResumeFeedbackType>().notNull(),
    fileName: text("file_name").notNull(),
    fileType: text("file_type").notNull(),
    fileSize: text("file_size").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
})

export const mockTest = pgTable("mock_test", {
    id: text("id")
        .primaryKey()
        .$default(() => nanoid()),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    question_count: text("question_count").notNull(),
    describe_topics: text("describe_topics").notNull(),
    questions_level: text("questions_level").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
})

export const mockTestQuestions = pgTable("mock_test_questions", {
    id: text("id")
        .primaryKey()
        .$default(() => nanoid()),
    mockTestId: text("mock_test_id")
        .notNull()
        .references(() => mockTest.id, { onDelete: "cascade" }),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    sequence: integer("sequence").notNull(),
    question: text("question").notNull(),
    options: jsonb("options").$type<string[]>().notNull(),
    correctAnswerIndex: integer("correct_answer_index").notNull(),
    explanation_for_correctAnswer: text("explanation_for_correct_answer").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
})

export const mockTestUserAnswer = pgTable("mock_test_user_answer", {
    id: text("id")
        .primaryKey()
        .$default(() => nanoid()),
    mockTestId: text("mock_test_id")
        .notNull()
        .references(() => mockTest.id, { onDelete: "cascade" }),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    sequence: integer("sequence").notNull(),
    userAnswerIndex: integer("user_answer_index").notNull(),
    isCorrect: boolean("is_correct").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
})

export const mockTestOverallResult = pgTable("mock_test_overall_result", {
    id: text("id")
        .primaryKey()
        .$default(() => nanoid()),
    mockTestId: text("mock_test_id")
        .notNull()
        .references(() => mockTest.id, { onDelete: "cascade" }),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    overall_score: integer("overall_score").notNull(),
    overallFeedback: text("overall_feedback").notNull(),
    summaryComment: text("summary_comment").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
})