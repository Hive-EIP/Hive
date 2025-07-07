--
-- PostgreSQL database dump
--

-- Dumped from database version 14.15 (Homebrew)
-- Dumped by pg_dump version 14.15 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: team_invitations; Type: TABLE; Schema: public; Owner: hive
--

CREATE TABLE public.team_invitations (
    id integer NOT NULL,
    team_id integer,
    invited_user_id integer,
    invited_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'pending'::character varying
);


ALTER TABLE public.team_invitations OWNER TO hive;

--
-- Name: team_invitations_id_seq; Type: SEQUENCE; Schema: public; Owner: hive
--

CREATE SEQUENCE public.team_invitations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.team_invitations_id_seq OWNER TO hive;

--
-- Name: team_invitations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hive
--

ALTER SEQUENCE public.team_invitations_id_seq OWNED BY public.team_invitations.id;


--
-- Name: team_members; Type: TABLE; Schema: public; Owner: hive
--

CREATE TABLE public.team_members (
    user_id integer,
    team_id integer,
    role character varying(20) DEFAULT 'member'::character varying,
    joined_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    game character varying(50) DEFAULT 'undefined'::character varying NOT NULL
);


ALTER TABLE public.team_members OWNER TO hive;

--
-- Name: teams; Type: TABLE; Schema: public; Owner: hive
--

CREATE TABLE public.teams (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    tag character varying(10),
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    owner_id integer,
    created_by integer,
    status character varying(20) DEFAULT 'open'::character varying,
    rank_points integer DEFAULT 0,
    elo integer DEFAULT 0,
    CONSTRAINT teams_elo_check CHECK (((elo >= 0) AND (elo <= 10))),
    CONSTRAINT teams_rank_points_check CHECK ((rank_points >= 0))
);


ALTER TABLE public.teams OWNER TO hive;

--
-- Name: teams_id_seq; Type: SEQUENCE; Schema: public; Owner: hive
--

CREATE SEQUENCE public.teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.teams_id_seq OWNER TO hive;

--
-- Name: teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hive
--

ALTER SEQUENCE public.teams_id_seq OWNED BY public.teams.id;


--
-- Name: tournament_matches; Type: TABLE; Schema: public; Owner: hive
--

CREATE TABLE public.tournament_matches (
    id integer NOT NULL,
    tournament_id integer,
    round integer NOT NULL,
    team_a_id integer,
    team_b_id integer,
    winner_id integer,
    match_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tournament_matches OWNER TO hive;

--
-- Name: tournament_matches_id_seq; Type: SEQUENCE; Schema: public; Owner: hive
--

CREATE SEQUENCE public.tournament_matches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tournament_matches_id_seq OWNER TO hive;

--
-- Name: tournament_matches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hive
--

ALTER SEQUENCE public.tournament_matches_id_seq OWNED BY public.tournament_matches.id;


--
-- Name: tournament_participants; Type: TABLE; Schema: public; Owner: hive
--

CREATE TABLE public.tournament_participants (
    tournament_id integer NOT NULL,
    team_id integer NOT NULL,
    joined_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tournament_participants OWNER TO hive;

--
-- Name: tournament_registrations; Type: TABLE; Schema: public; Owner: hive
--

CREATE TABLE public.tournament_registrations (
    id integer NOT NULL,
    tournament_id integer,
    team_id integer,
    registered_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tournament_registrations OWNER TO hive;

--
-- Name: tournament_registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: hive
--

CREATE SEQUENCE public.tournament_registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tournament_registrations_id_seq OWNER TO hive;

--
-- Name: tournament_registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hive
--

ALTER SEQUENCE public.tournament_registrations_id_seq OWNED BY public.tournament_registrations.id;


--
-- Name: tournaments; Type: TABLE; Schema: public; Owner: hive
--

CREATE TABLE public.tournaments (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    game character varying(50) NOT NULL,
    description text,
    start_date timestamp without time zone NOT NULL,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'upcoming'::character varying,
    elo_min integer DEFAULT 0,
    elo_max integer DEFAULT 10
);


ALTER TABLE public.tournaments OWNER TO hive;

--
-- Name: tournaments_id_seq; Type: SEQUENCE; Schema: public; Owner: hive
--

CREATE SEQUENCE public.tournaments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tournaments_id_seq OWNER TO hive;

--
-- Name: tournaments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hive
--

ALTER SEQUENCE public.tournaments_id_seq OWNED BY public.tournaments.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: hive
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    username character varying(255),
    role character varying(50) DEFAULT 'user'::character varying,
    reset_token text,
    reset_token_expires timestamp without time zone
);


ALTER TABLE public.users OWNER TO hive;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: hive
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO hive;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hive
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: team_invitations id; Type: DEFAULT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.team_invitations ALTER COLUMN id SET DEFAULT nextval('public.team_invitations_id_seq'::regclass);


--
-- Name: teams id; Type: DEFAULT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.teams_id_seq'::regclass);


--
-- Name: tournament_matches id; Type: DEFAULT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.tournament_matches ALTER COLUMN id SET DEFAULT nextval('public.tournament_matches_id_seq'::regclass);


--
-- Name: tournament_registrations id; Type: DEFAULT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.tournament_registrations ALTER COLUMN id SET DEFAULT nextval('public.tournament_registrations_id_seq'::regclass);


--
-- Name: tournaments id; Type: DEFAULT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.tournaments ALTER COLUMN id SET DEFAULT nextval('public.tournaments_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: team_invitations; Type: TABLE DATA; Schema: public; Owner: hive
--

COPY public.team_invitations (id, team_id, invited_user_id, invited_by, created_at, status) FROM stdin;
5	2	8	2	2025-06-28 22:19:40.228636	pending
\.


--
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: hive
--

COPY public.team_members (user_id, team_id, role, joined_at, game) FROM stdin;
1	3	owner	2025-06-28 17:13:34.874393	LoL
2	1	member	2025-06-28 17:45:49.439803	LoL
3	2	member	2025-06-28 17:48:31.190674	LoL
\.


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: hive
--

COPY public.teams (id, name, tag, description, created_at, owner_id, created_by, status, rank_points, elo) FROM stdin;
1	Equipe Hive	Lol	\N	2025-06-28 16:01:31.912646	1	1	open	0	0
2	Anti-abeilles	Lol	\N	2025-06-28 17:04:19.29788	2	2	open	0	0
3	EL PHENOMENO'S TEAM	LoL	El phenomeno vaincra, ecrasera. Equipe maitre de la remontada, TAH' ALLAH	2025-06-28 17:13:34.861052	1	1	open	0	0
\.


--
-- Data for Name: tournament_matches; Type: TABLE DATA; Schema: public; Owner: hive
--

COPY public.tournament_matches (id, tournament_id, round, team_a_id, team_b_id, winner_id, match_time) FROM stdin;
\.


--
-- Data for Name: tournament_participants; Type: TABLE DATA; Schema: public; Owner: hive
--

COPY public.tournament_participants (tournament_id, team_id, joined_at) FROM stdin;
\.


--
-- Data for Name: tournament_registrations; Type: TABLE DATA; Schema: public; Owner: hive
--

COPY public.tournament_registrations (id, tournament_id, team_id, registered_at) FROM stdin;
\.


--
-- Data for Name: tournaments; Type: TABLE DATA; Schema: public; Owner: hive
--

COPY public.tournaments (id, name, game, description, start_date, created_by, created_at, status, elo_min, elo_max) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: hive
--

COPY public.users (id, email, password, created_at, username, role, reset_token, reset_token_expires) FROM stdin;
8	LeGabBresilien@gmail.com	$2b$10$dYMeC1BXv/rudxqjGA.a/udHvtsABwkvViLSOFPlUgX0M.XoBZeX.	2025-06-28 20:53:48.287837	Gabynho	user	\N	\N
9	nanrientqt@gmail.com	$2b$10$cK0qwDFVKw4oIoHxA4GaouUn/NSALklLzZX1VCYGhQ.mgOu1O0i4i	2025-06-28 20:54:14.649755	HYSPASSEQUOI	user	\N	\N
10	sixMacnuggetsetunegrandefritte@gmail.com	$2b$10$KQiTq5nwrneACJ5NmCwSeOQ5oKvTUQk2rt/.AxTjCQyuGTgOYW28.	2025-06-28 20:55:07.832785	Sucemaquequettegunegrandebite	user	\N	\N
11	Razmo@gmail.com	$2b$10$prkn5eKsMTihbMwSISC7t.3OORHd7PkIpg8WEYLaiXmuRJGBPkQGq	2025-06-28 20:55:45.671259	ImagineMoiChauve	user	\N	\N
12	PrimePolonais@gmail.com	$2b$10$3FQh9V5EaVbrr/ttzOq0O.QKT746FKiFa2DdADwXOhvnfx5D3TF9K	2025-06-28 20:56:42.85586	TahLewandowski	user	\N	\N
13	TLeBaptouDemaVie@gmail.com	$2b$10$fXemqLWSWtuNUnv8WNmVs.wRWYGeVEFgMfnDWvAUwnZ8l9v9HD/kO	2025-06-28 20:57:24.168661	OhMonDimitri	user	\N	\N
14	TLepanaché@gmail.com	$2b$10$pl9gsQ/I3aIPdnk9Yexei.4VFNnQ/P9CYekwm3FcIbbp6mC4y57jK	2025-06-28 20:57:46.896538	JsuisLaVodka	user	\N	\N
15	EffiPiazzi@gmail.com	$2b$10$IAm7AuIAJU4RE.c/unH.bO3iWFxT4nx5KjVuswcyg7YFx8gQhsZAm	2025-06-28 20:58:29.445902	Gugge	user	\N	\N
16	messi@gmail.com	$2b$10$6CHGcciATVDD3SSFnnLICe4dwn0HPFXFT5PHpqEH/37LGEuJMxNGC	2025-06-28 20:58:54.376454	leo	user	\N	\N
17	FakeGoa@gmail.com	$2b$10$x7syptdB.OWwUI25eDFPEuUqRuhzi6BiKZplt3OPRE4Kmlad3vRj6	2025-06-28 20:59:36.314174	CR7	user	\N	\N
3	nicolas.lefevre@epitech.eu	$2b$10$YVi8ggUIApZOgWqUPeRv8.jtL.ONJdRUniJxRUm344zjoq3X2bL0u	2025-06-26 00:00:19.926629	nico	admin	3e3799e97e7eb0432b5e96899e28b9e69c87a777cab4f5deec7d027eb5c07901	2025-06-27 19:42:29.019
2	yoann-godard@hotmail.com	$2b$10$NZpklyJd6QinQeCC0Vq6UuHvpSBNdX4ngPBI2EN4YMIcKCRPngxf.	2025-06-26 18:01:48.135833	Yoyotaa	moderator	083702217083845e31228e4603483078990d846546997c0d2640ae41203c7c24	2025-06-27 20:10:17.862
1	rouchon.gabriel@gmail.com	$2b$10$LSx.HMdoOXjVwlgktfakcuuGvQZ3zqGkv7vrBecfzrHa5gV5EstkK	2025-06-25 23:59:19.399666	HYSPA	user	c9c549aedc85e250c27d681df4d9023210dec6978ab86427c03457702d73f35d	2025-06-27 20:12:31.357
6	cdelachapelle4@gmail.com	$2b$10$eo8hU04wvJUetVRDDIQIKu4RyKwnjT8cvrGwIurm./4WjQUwqv3ze	2025-06-28 04:37:09.728391	Yrelionne	admin	\N	\N
7	elphenomenoxD@gmail.com	$2b$10$7wZpTlNmSvlmP8yMCpTVRusTXvF5NjhvorwfgcnQnAWZrWAwEPj46	2025-06-28 20:52:35.735707	Zoltan	user	\N	\N
\.


--
-- Name: team_invitations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hive
--

SELECT pg_catalog.setval('public.team_invitations_id_seq', 5, true);


--
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hive
--

SELECT pg_catalog.setval('public.teams_id_seq', 8, true);


--
-- Name: tournament_matches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hive
--

SELECT pg_catalog.setval('public.tournament_matches_id_seq', 1, false);


--
-- Name: tournament_registrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hive
--

SELECT pg_catalog.setval('public.tournament_registrations_id_seq', 1, false);


--
-- Name: tournaments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hive
--

SELECT pg_catalog.setval('public.tournaments_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hive
--

SELECT pg_catalog.setval('public.users_id_seq', 17, true);


--
-- Name: team_invitations team_invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.team_invitations
    ADD CONSTRAINT team_invitations_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_user_id_key; Type: CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_user_id_key UNIQUE (user_id);


--
-- Name: teams teams_name_key; Type: CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_name_key UNIQUE (name);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: tournament_matches tournament_matches_pkey; Type: CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.tournament_matches
    ADD CONSTRAINT tournament_matches_pkey PRIMARY KEY (id);


--
-- Name: tournament_participants tournament_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.tournament_participants
    ADD CONSTRAINT tournament_participants_pkey PRIMARY KEY (tournament_id, team_id);


--
-- Name: tournament_registrations tournament_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.tournament_registrations
    ADD CONSTRAINT tournament_registrations_pkey PRIMARY KEY (id);


--
-- Name: tournament_registrations tournament_registrations_tournament_id_team_id_key; Type: CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.tournament_registrations
    ADD CONSTRAINT tournament_registrations_tournament_id_team_id_key UNIQUE (tournament_id, team_id);


--
-- Name: tournaments tournaments_pkey; Type: CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT tournaments_pkey PRIMARY KEY (id);


--
-- Name: team_members unique_user_game; Type: CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT unique_user_game UNIQUE (user_id, game);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: teams fk_created_by; Type: FK CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: team_invitations team_invitations_invited_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.team_invitations
    ADD CONSTRAINT team_invitations_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: team_invitations team_invitations_invited_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.team_invitations
    ADD CONSTRAINT team_invitations_invited_user_id_fkey FOREIGN KEY (invited_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: team_invitations team_invitations_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.team_invitations
    ADD CONSTRAINT team_invitations_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- Name: team_members team_members_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- Name: team_members team_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: teams teams_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: tournament_matches tournament_matches_team_a_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.tournament_matches
    ADD CONSTRAINT tournament_matches_team_a_id_fkey FOREIGN KEY (team_a_id) REFERENCES public.teams(id) ON DELETE SET NULL;


--
-- Name: tournament_matches tournament_matches_team_b_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.tournament_matches
    ADD CONSTRAINT tournament_matches_team_b_id_fkey FOREIGN KEY (team_b_id) REFERENCES public.teams(id) ON DELETE SET NULL;


--
-- Name: tournament_matches tournament_matches_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.tournament_matches
    ADD CONSTRAINT tournament_matches_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;


--
-- Name: tournament_matches tournament_matches_winner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.tournament_matches
    ADD CONSTRAINT tournament_matches_winner_id_fkey FOREIGN KEY (winner_id) REFERENCES public.teams(id) ON DELETE SET NULL;


--
-- Name: tournament_participants tournament_participants_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.tournament_participants
    ADD CONSTRAINT tournament_participants_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- Name: tournament_participants tournament_participants_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.tournament_participants
    ADD CONSTRAINT tournament_participants_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;


--
-- Name: tournament_registrations tournament_registrations_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.tournament_registrations
    ADD CONSTRAINT tournament_registrations_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- Name: tournament_registrations tournament_registrations_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.tournament_registrations
    ADD CONSTRAINT tournament_registrations_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;


--
-- Name: tournaments tournaments_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hive
--

ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT tournaments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

