--
-- PostgreSQL database dump
--

\restrict b50tlGN66vwfEtHHg7LE89qkzL22PNWtDiSYRH7AY2W8Ca8VduWSmbAjwEQyeEW

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: prisma_contract; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA prisma_contract;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: contract; Type: TABLE; Schema: prisma_contract; Owner: -
--

CREATE TABLE prisma_contract.contract (
    core_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    contract_json jsonb NOT NULL
);


--
-- Name: ledger; Type: TABLE; Schema: prisma_contract; Owner: -
--

CREATE TABLE prisma_contract.ledger (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    space text NOT NULL,
    migration_name text NOT NULL,
    migration_hash text NOT NULL,
    origin_core_hash text,
    origin_profile_hash text,
    destination_core_hash text NOT NULL,
    destination_profile_hash text,
    operations jsonb NOT NULL
);


--
-- Name: ledger_id_seq; Type: SEQUENCE; Schema: prisma_contract; Owner: -
--

CREATE SEQUENCE prisma_contract.ledger_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ledger_id_seq; Type: SEQUENCE OWNED BY; Schema: prisma_contract; Owner: -
--

ALTER SEQUENCE prisma_contract.ledger_id_seq OWNED BY prisma_contract.ledger.id;


--
-- Name: marker; Type: TABLE; Schema: prisma_contract; Owner: -
--

CREATE TABLE prisma_contract.marker (
    space text DEFAULT 'app'::text NOT NULL,
    core_hash text NOT NULL,
    profile_hash text NOT NULL,
    contract_json jsonb,
    canonical_version integer,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    app_tag text,
    meta jsonb DEFAULT '{}'::jsonb NOT NULL,
    invariants text[] DEFAULT '{}'::text[] NOT NULL
);


--
-- Name: attachment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attachment (
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "createdByUserId" integer NOT NULL,
    "fileName" text NOT NULL,
    "fileSize" integer NOT NULL,
    "fileUrl" text NOT NULL,
    id integer NOT NULL,
    "mimeType" text NOT NULL,
    "taskId" integer NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: attachment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.attachment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: attachment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.attachment_id_seq OWNED BY public.attachment.id;


--
-- Name: auditLog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."auditLog" (
    action text NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "createdByUserId" integer NOT NULL,
    "entityId" integer NOT NULL,
    "entityType" text NOT NULL,
    id integer NOT NULL,
    metadata json,
    "projectId" integer NOT NULL
);


--
-- Name: auditLog_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."auditLog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: auditLog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."auditLog_id_seq" OWNED BY public."auditLog".id;


--
-- Name: comment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comment (
    content text NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "createdByUserId" integer NOT NULL,
    id integer NOT NULL,
    "taskId" integer NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: comment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comment_id_seq OWNED BY public.comment.id;


--
-- Name: label; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.label (
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    id integer NOT NULL,
    name text NOT NULL,
    "projectId" integer NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: label_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.label_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: label_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.label_id_seq OWNED BY public.label.id;


--
-- Name: notification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification (
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "entityId" integer NOT NULL,
    "entityType" text NOT NULL,
    id integer NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    message text NOT NULL,
    metadata json,
    type text NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer NOT NULL
);


--
-- Name: notification_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notification_id_seq OWNED BY public.notification.id;


--
-- Name: organization; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization (
    id integer NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: organization_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.organization_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: organization_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.organization_id_seq OWNED BY public.organization.id;


--
-- Name: organization_member; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_member (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "organizationId" integer NOT NULL,
    role text DEFAULT 'Member'::text NOT NULL
);


--
-- Name: organization_member_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.organization_member_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: organization_member_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.organization_member_id_seq OWNED BY public.organization_member.id;


--
-- Name: processedEvent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."processedEvent" (
    "eventId" text NOT NULL,
    "eventType" text NOT NULL,
    id integer NOT NULL,
    "processedAt" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: processedEvent_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."processedEvent_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: processedEvent_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."processedEvent_id_seq" OWNED BY public."processedEvent".id;


--
-- Name: project; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project (
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "createdByUserId" integer NOT NULL,
    description text,
    id integer NOT NULL,
    name text NOT NULL,
    "organizationId" integer NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: project_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.project_id_seq OWNED BY public.project.id;


--
-- Name: task; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.task (
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "createdByUserId" integer NOT NULL,
    description text,
    id integer NOT NULL,
    "projectId" integer NOT NULL,
    title text NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "statusId" integer NOT NULL,
    "assignedToUserId" integer
);


--
-- Name: taskLabel; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."taskLabel" (
    "labelId" integer NOT NULL,
    "taskId" integer NOT NULL
);


--
-- Name: taskStatus; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."taskStatus" (
    id integer NOT NULL,
    name text NOT NULL,
    "position" integer NOT NULL,
    "projectId" integer NOT NULL
);


--
-- Name: taskStatus_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."taskStatus_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: taskStatus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."taskStatus_id_seq" OWNED BY public."taskStatus".id;


--
-- Name: task_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.task_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.task_id_seq OWNED BY public.task.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    email text NOT NULL,
    id integer NOT NULL,
    name text NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "passwordHash" text NOT NULL
);


--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: ledger id; Type: DEFAULT; Schema: prisma_contract; Owner: -
--

ALTER TABLE ONLY prisma_contract.ledger ALTER COLUMN id SET DEFAULT nextval('prisma_contract.ledger_id_seq'::regclass);


--
-- Name: attachment id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attachment ALTER COLUMN id SET DEFAULT nextval('public.attachment_id_seq'::regclass);


--
-- Name: auditLog id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."auditLog" ALTER COLUMN id SET DEFAULT nextval('public."auditLog_id_seq"'::regclass);


--
-- Name: comment id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment ALTER COLUMN id SET DEFAULT nextval('public.comment_id_seq'::regclass);


--
-- Name: label id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.label ALTER COLUMN id SET DEFAULT nextval('public.label_id_seq'::regclass);


--
-- Name: notification id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification ALTER COLUMN id SET DEFAULT nextval('public.notification_id_seq'::regclass);


--
-- Name: organization id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization ALTER COLUMN id SET DEFAULT nextval('public.organization_id_seq'::regclass);


--
-- Name: organization_member id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_member ALTER COLUMN id SET DEFAULT nextval('public.organization_member_id_seq'::regclass);


--
-- Name: processedEvent id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."processedEvent" ALTER COLUMN id SET DEFAULT nextval('public."processedEvent_id_seq"'::regclass);


--
-- Name: project id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project ALTER COLUMN id SET DEFAULT nextval('public.project_id_seq'::regclass);


--
-- Name: task id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task ALTER COLUMN id SET DEFAULT nextval('public.task_id_seq'::regclass);


--
-- Name: taskStatus id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."taskStatus" ALTER COLUMN id SET DEFAULT nextval('public."taskStatus_id_seq"'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Name: contract contract_pkey; Type: CONSTRAINT; Schema: prisma_contract; Owner: -
--

ALTER TABLE ONLY prisma_contract.contract
    ADD CONSTRAINT contract_pkey PRIMARY KEY (core_hash);


--
-- Name: ledger ledger_pkey; Type: CONSTRAINT; Schema: prisma_contract; Owner: -
--

ALTER TABLE ONLY prisma_contract.ledger
    ADD CONSTRAINT ledger_pkey PRIMARY KEY (id);


--
-- Name: marker marker_pkey; Type: CONSTRAINT; Schema: prisma_contract; Owner: -
--

ALTER TABLE ONLY prisma_contract.marker
    ADD CONSTRAINT marker_pkey PRIMARY KEY (space);


--
-- Name: attachment attachment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attachment
    ADD CONSTRAINT attachment_pkey PRIMARY KEY (id);


--
-- Name: auditLog auditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."auditLog"
    ADD CONSTRAINT "auditLog_pkey" PRIMARY KEY (id);


--
-- Name: comment comment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_pkey PRIMARY KEY (id);


--
-- Name: label label_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.label
    ADD CONSTRAINT label_pkey PRIMARY KEY (id);


--
-- Name: label label_projectId_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.label
    ADD CONSTRAINT "label_projectId_name_key" UNIQUE ("projectId", name);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id);


--
-- Name: organization_member organization_member_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_member
    ADD CONSTRAINT organization_member_pkey PRIMARY KEY (id);


--
-- Name: organization_member organization_member_userId_organizationId_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_member
    ADD CONSTRAINT "organization_member_userId_organizationId_key" UNIQUE ("userId", "organizationId");


--
-- Name: organization organization_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_pkey PRIMARY KEY (id);


--
-- Name: processedEvent processedEvent_eventId_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."processedEvent"
    ADD CONSTRAINT "processedEvent_eventId_key" UNIQUE ("eventId");


--
-- Name: processedEvent processedEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."processedEvent"
    ADD CONSTRAINT "processedEvent_pkey" PRIMARY KEY (id);


--
-- Name: project project_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (id);


--
-- Name: taskLabel taskLabel_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."taskLabel"
    ADD CONSTRAINT "taskLabel_pkey" PRIMARY KEY ("taskId", "labelId");


--
-- Name: taskStatus taskStatus_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."taskStatus"
    ADD CONSTRAINT "taskStatus_pkey" PRIMARY KEY (id);


--
-- Name: taskStatus taskStatus_projectId_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."taskStatus"
    ADD CONSTRAINT "taskStatus_projectId_name_key" UNIQUE ("projectId", name);


--
-- Name: task task_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_pkey PRIMARY KEY (id);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: attachment_createdByUserId_idx_93e8a540; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "attachment_createdByUserId_idx_93e8a540" ON public.attachment USING btree ("createdByUserId");


--
-- Name: attachment_taskId_idx_4965c936; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "attachment_taskId_idx_4965c936" ON public.attachment USING btree ("taskId");


--
-- Name: auditLog_createdByUserId_createdAt_idx_c7fac170; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "auditLog_createdByUserId_createdAt_idx_c7fac170" ON public."auditLog" USING btree ("createdByUserId", "createdAt");


--
-- Name: auditLog_createdByUserId_idx_93e8a540; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "auditLog_createdByUserId_idx_93e8a540" ON public."auditLog" USING btree ("createdByUserId");


--
-- Name: auditLog_projectId_createdAt_idx_d2d6484f; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "auditLog_projectId_createdAt_idx_d2d6484f" ON public."auditLog" USING btree ("projectId", "createdAt");


--
-- Name: auditLog_projectId_idx_a96e4d92; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "auditLog_projectId_idx_a96e4d92" ON public."auditLog" USING btree ("projectId");


--
-- Name: comment_createdByUserId_idx_93e8a540; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "comment_createdByUserId_idx_93e8a540" ON public.comment USING btree ("createdByUserId");


--
-- Name: comment_taskId_idx_4965c936; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "comment_taskId_idx_4965c936" ON public.comment USING btree ("taskId");


--
-- Name: label_projectId_idx_a96e4d92; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "label_projectId_idx_a96e4d92" ON public.label USING btree ("projectId");


--
-- Name: notification_userId_idx_a489d58a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "notification_userId_idx_a489d58a" ON public.notification USING btree ("userId");


--
-- Name: notification_userId_isRead_createdAt_idx_33778255; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "notification_userId_isRead_createdAt_idx_33778255" ON public.notification USING btree ("userId", "isRead", "createdAt");


--
-- Name: organization_member_organizationId_idx_2e17ef41; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "organization_member_organizationId_idx_2e17ef41" ON public.organization_member USING btree ("organizationId");


--
-- Name: organization_member_userId_idx_a489d58a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "organization_member_userId_idx_a489d58a" ON public.organization_member USING btree ("userId");


--
-- Name: project_createdByUserId_idx_93e8a540; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "project_createdByUserId_idx_93e8a540" ON public.project USING btree ("createdByUserId");


--
-- Name: project_organizationId_idx_2e17ef41; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "project_organizationId_idx_2e17ef41" ON public.project USING btree ("organizationId");


--
-- Name: taskLabel_labelId_idx_e2585939; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "taskLabel_labelId_idx_e2585939" ON public."taskLabel" USING btree ("labelId");


--
-- Name: taskLabel_taskId_idx_4965c936; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "taskLabel_taskId_idx_4965c936" ON public."taskLabel" USING btree ("taskId");


--
-- Name: taskStatus_projectId_idx_a96e4d92; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "taskStatus_projectId_idx_a96e4d92" ON public."taskStatus" USING btree ("projectId");


--
-- Name: task_assignedToUserId_idx_890f5955; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "task_assignedToUserId_idx_890f5955" ON public.task USING btree ("assignedToUserId");


--
-- Name: task_createdByUserId_idx_93e8a540; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "task_createdByUserId_idx_93e8a540" ON public.task USING btree ("createdByUserId");


--
-- Name: task_projectId_idx_a96e4d92; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "task_projectId_idx_a96e4d92" ON public.task USING btree ("projectId");


--
-- Name: task_statusId_idx_e5a44bce; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "task_statusId_idx_e5a44bce" ON public.task USING btree ("statusId");


--
-- Name: attachment attachment_createdByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attachment
    ADD CONSTRAINT "attachment_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES public."user"(id);


--
-- Name: attachment attachment_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attachment
    ADD CONSTRAINT "attachment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public.task(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: auditLog auditLog_createdByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."auditLog"
    ADD CONSTRAINT "auditLog_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES public."user"(id);


--
-- Name: auditLog auditLog_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."auditLog"
    ADD CONSTRAINT "auditLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.project(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comment comment_createdByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "comment_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES public."user"(id);


--
-- Name: comment comment_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "comment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public.task(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: label label_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.label
    ADD CONSTRAINT "label_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.project(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notification notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: organization_member organization_member_organization_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_member
    ADD CONSTRAINT organization_member_organization_fkey FOREIGN KEY ("organizationId") REFERENCES public.organization(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: organization_member organization_member_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_member
    ADD CONSTRAINT organization_member_user_fkey FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE;


--
-- Name: project project_createdByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT "project_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES public."user"(id);


--
-- Name: project project_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT "project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public.organization(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: taskLabel taskLabel_labelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."taskLabel"
    ADD CONSTRAINT "taskLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES public.label(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: taskLabel taskLabel_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."taskLabel"
    ADD CONSTRAINT "taskLabel_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public.task(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: taskStatus taskStatus_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."taskStatus"
    ADD CONSTRAINT "taskStatus_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.project(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: task task_assignedToUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT "task_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: task task_createdByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT "task_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES public."user"(id);


--
-- Name: task task_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT "task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.project(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: task task_statusId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT "task_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES public."taskStatus"(id);


--
-- PostgreSQL database dump complete
--

\unrestrict b50tlGN66vwfEtHHg7LE89qkzL22PNWtDiSYRH7AY2W8Ca8VduWSmbAjwEQyeEW

