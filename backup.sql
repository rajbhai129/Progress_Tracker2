--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: chapters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chapters (
    id integer NOT NULL,
    subject_id integer,
    name character varying(255) NOT NULL,
    weightage double precision NOT NULL,
    user_id integer
);


ALTER TABLE public.chapters OWNER TO postgres;

--
-- Name: chapters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chapters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chapters_id_seq OWNER TO postgres;

--
-- Name: chapters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chapters_id_seq OWNED BY public.chapters.id;


--
-- Name: components; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.components (
    id integer NOT NULL,
    chapter_id integer,
    name character varying(255) NOT NULL,
    weightage double precision NOT NULL,
    completed boolean DEFAULT false,
    user_id integer
);


ALTER TABLE public.components OWNER TO postgres;

--
-- Name: components_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.components_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.components_id_seq OWNER TO postgres;

--
-- Name: components_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.components_id_seq OWNED BY public.components.id;


--
-- Name: subjects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subjects (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    weightage double precision NOT NULL,
    user_id integer
);


ALTER TABLE public.subjects OWNER TO postgres;

--
-- Name: subjects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subjects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.subjects_id_seq OWNER TO postgres;

--
-- Name: subjects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subjects_id_seq OWNED BY public.subjects.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: chapters id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapters ALTER COLUMN id SET DEFAULT nextval('public.chapters_id_seq'::regclass);


--
-- Name: components id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.components ALTER COLUMN id SET DEFAULT nextval('public.components_id_seq'::regclass);


--
-- Name: subjects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects ALTER COLUMN id SET DEFAULT nextval('public.subjects_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: chapters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chapters (id, subject_id, name, weightage, user_id) FROM stdin;
38	4	11th ke chapter	50	\N
39	4	12th ke chapter	50	\N
40	5	11th ke chapter	50	\N
41	5	12th ke chapter	50	\N
42	6	11th ke chapter	50	\N
43	6	12th ke chapter	50	\N
44	7	11th ke chapter	50	1
45	7	12th ke chapter	50	1
46	10	Mechanical Properties of Solids	3	2
47	10	Moving Charges and Magnetism	5	2
48	10	Center of Mass & System of Particles	2	2
49	10	Wave Optics\t	2	2
50	10	Electromagnetic Induction	3	2
51	10	Mechanical Properties of Fluids	3	2
52	10	Electromagnetic Waves	3	2
53	10	Rotational Motion	6	2
54	10	Oscillations	3	2
55	10	Ray Optics and Optical Instruments	6	2
57	10	Dual Nature of Radiation and Matter	3	2
60	10	Kinetic Theory of Gases	3	2
61	10	Gravitation	3	2
62	10	Current Electricity	10	2
63	10	Semiconductor Electronics: Materials, Devices and Simple Circuits	5	2
64	10	Units and Measurements	5	2
65	10	Work Energy and Power	3	2
66	10	Electric Charges and Fields	3	2
67	10	Magnetism and Matter	1	2
68	10	Atoms	3	2
69	10	Nuclei	4	2
70	10	Motion in a Plane	3	2
71	10	Mathematical Tools & Vectors	1	2
72	10	Laws of Motion	2	2
73	10	Thermodynamics	2	2
74	10	Waves	1	2
75	10	Electrostatic Potential and Capacitance	5	2
76	10	Alternating Current	4	2
77	10	Thermal Propewrties of Matter	1	2
78	10	Motion in a Straight Line	3	2
80	11	Organic Chemistry: Some Basic Principles and Techniques	5	2
81	11	Alcohols, Phenols and Ethers	4	2
82	11	Redox Reactions	3	2
83	11	Structure of Atom	4	2
84	11	Thermodynamics	5	2
85	11	Electrochemistry	5	2
86	11	Hydrocarbons	7	2
87	11	The p-Block Elements (XII)	6	2
88	11	The p-Block Elements	6	2
89	11	Chemical Bonding and Molecular Structure	7	2
90	11	Classification of Elements and Periodicity in Properties	2	2
91	11	Equilibrium	6	2
92	11	Chemical Kinetics	5	2
93	11	Biomolecules	4	2
94	11	Haloalkanes and Haloarenes	4	2
95	11	Solutions	4	2
96	11	Some Basic Concepts of Chemistry	4	2
97	11	Coordination Compounds	5	2
98	11	Aldehydes, Ketones and Carboxylic Acids	9	2
99	11	Amines\t	5	2
100	11	The d and f-Block Elements	6	2
101	15	Biodiversity and Conservation	4	2
102	15	Anatomy of Flowering Plants	7	2
103	15	Cell : The Unit of Life	5	2
104	15	Respiration in Plants	4	2
105	15	Microbes in Human Welfare	4	2
106	15	Cell Cycle and Cell Division	9	2
107	15	Molecular Basis of Inheritance	14	2
108	15	Principles of Inheritance and Variation	10	2
109	15	Sexual Reproduction in Flowering Plants	6	2
110	15	Ecosystem\t	4	2
111	15	Morphology of Flowering Plants	6	2
112	15	Plant Growth and Development	6	2
113	15	The Living World	1	2
114	15	Plant Kingdom	7	2
115	15	Biological Classification	3	2
116	15	Organisms and Populations	4	2
117	15	Photosynthesis in Higher Plants	4	2
\.


--
-- Data for Name: components; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.components (id, chapter_id, name, weightage, completed, user_id) FROM stdin;
96	65	Test	10	f	2
97	66	Lecture	30	f	2
98	66	Practice	30	f	2
99	66	Revision	20	f	2
100	66	Previous Year Question Practice	10	f	2
101	66	Test	10	f	2
102	67	Lecture	30	f	2
103	67	Practice	30	f	2
104	67	Revision	20	f	2
82	63	Lecture	30	f	2
83	63	Practice	30	f	2
84	63	Revision	20	f	2
85	63	Previous Year Question Practice	10	f	2
3	38	revision	20	t	\N
4	38	pyq	10	t	\N
5	38	test	10	t	\N
2	38	practice	30	t	\N
86	63	Test	10	f	2
1	38	lect	30	t	\N
6	44	lect	30	t	1
8	44	revision	20	t	1
9	44	pyq	10	t	1
10	44	test	10	t	1
7	44	practice	30	t	1
87	64	Lecture	30	f	2
88	64	Practice	30	f	2
89	64	Revision	20	f	2
90	64	Previous Year Question Practice	20	f	2
91	64	Test	10	f	2
14	46	Previous Year Question Practice	10	t	2
12	46	Practice	30	t	2
30	49	Test	10	f	2
31	50	Lecture	30	f	2
32	50	Practice	30	f	2
33	50	Revision	20	f	2
34	50	Previous Year Question Practice	10	f	2
35	50	Test	10	f	2
36	51	Lecture	30	f	2
37	51	Practice	30	f	2
38	51	Revision	20	f	2
40	51	Previous Year Question Practice	10	f	2
41	51	Test	10	f	2
42	52	Lecture	30	f	2
43	52	Practice	30	f	2
44	52	Revision	20	f	2
45	52	Previous Year Question Practice	10	f	2
46	52	Test	10	f	2
47	53	Lecture	30	f	2
48	53	Practice	30	f	2
49	53	Revision	20	f	2
50	53	Previous Year Question Practice	10	f	2
51	53	Test	10	f	2
56	54	Test	10	f	2
57	55	Lecture	30	f	2
58	55	Practice	30	f	2
59	55	Revision	20	f	2
60	55	Previous Year Question Practice	10	f	2
61	55	Test	10	f	2
62	57	Lecture	30	f	2
63	57	Practice	30	f	2
64	57	Revision	20	f	2
65	57	Previous Year Question Practice	10	f	2
66	57	Test	10	f	2
67	60	Lecture	30	f	2
68	60	Practice	30	f	2
69	60	Revision	20	f	2
70	60	Previous Year Question Practice	10	f	2
71	60	Test	10	f	2
72	61	Lecture	30	f	2
73	61	Practice	30	f	2
74	61	Revision	20	f	2
75	61	Previous Year Question Practice	10	f	2
76	61	Test	10	f	2
77	62	Lecture	30	f	2
79	62	Revision	20	f	2
81	62	Test	10	f	2
80	62	Previous Year Question Practice	20	f	2
78	62	Practice	30	f	2
92	65	Lecture	30	f	2
93	65	Practice	30	f	2
94	65	Revision	20	f	2
95	65	Previous Year Question Practice	10	f	2
105	67	Previous Year Question Practice	10	f	2
106	67	Test	10	f	2
107	68	Lecture	30	f	2
108	68	Practice	30	f	2
109	68	Revision	20	f	2
110	68	Previous Year Question Practice	10	f	2
111	68	Test	10	f	2
112	69	Lecture	30	f	2
113	69	Practice	30	f	2
114	69	Revision	20	f	2
115	69	Previous Year Question Practice	10	f	2
116	69	Test	10	f	2
117	70	Lecture	30	f	2
118	70	Practice	30	f	2
119	70	Revision	20	f	2
120	70	Previous Year Question Practice	10	f	2
11	46	Lecture	30	t	2
15	46	Test	10	t	2
16	47	Lecture	30	t	2
18	47	Revision	20	t	2
20	47	Test	10	t	2
17	47	Practice	30	t	2
19	47	Previous Year Question Practice	10	t	2
21	48	Lecture	30	t	2
23	48	Revision	20	t	2
22	48	Practice	30	t	2
25	48	Test	10	t	2
26	49	Lecture	30	t	2
27	49	Practice	30	t	2
28	49	Revision	20	t	2
29	49	Previous Year Question Practice	10	t	2
55	54	Previous Year Question Practice	10	t	2
54	54	Revision	20	t	2
53	54	Practice	30	t	2
52	54	Lecture	30	t	2
121	70	Test	10	f	2
122	71	Lecture	30	f	2
123	71	Practice	30	f	2
124	71	Revision	20	f	2
125	71	Previous Year Question Practice	10	f	2
126	71	Test	10	f	2
127	72	Lecture	30	f	2
128	72	Practice	30	f	2
129	72	Revision	20	f	2
130	72	Previous Year Question Practice	10	f	2
131	72	Test	10	f	2
132	73	Lecture	30	f	2
133	73	Practice	30	f	2
134	73	Revision	20	f	2
135	73	Previous Year Question Practice	10	f	2
136	73	Test	10	f	2
137	74	Lecture	30	f	2
138	74	Practice	30	f	2
139	74	Revision	20	f	2
140	74	Previous Year Question Practice	10	f	2
141	74	Test	10	f	2
142	75	Lecture	30	f	2
143	75	Practice	30	f	2
144	75	Previous Year Question Practice	10	f	2
145	75	Revision	20	f	2
146	75	Test	10	f	2
147	76	Lecture	30	f	2
148	76	Practice	30	f	2
149	76	Revision	20	f	2
150	76	Previous Year Question Practice	10	f	2
151	76	Test	10	f	2
152	77	Lecture	30	f	2
153	77	Practice	30	f	2
154	77	Revision	20	f	2
155	77	Previous Year Question Practice	10	f	2
156	77	Test	10	f	2
157	78	Lecture	30	f	2
158	78	Practice	30	f	2
159	78	Revision	20	f	2
160	78	Previous Year Question Practice	10	f	2
161	78	Test	10	f	2
168	81	Lecture	30	f	2
169	81	Practice	30	f	2
170	81	Revision	20	f	2
171	81	Previous Year Question Practice	10	f	2
172	81	Test	10	f	2
173	82	Lecture	30	f	2
174	82	Practice	20	f	2
175	82	Revision	20	f	2
176	82	Previous Year Question Practice	10	f	2
177	82	Test	10	f	2
178	83	Lecture	30	f	2
179	83	Practice	30	f	2
180	83	Revision	20	f	2
181	83	Previous Year Question Practice	10	f	2
182	83	Test	10	f	2
183	84	Lecture	30	f	2
184	84	Practice	10	f	2
185	84	Revision	20	f	2
186	84	Previous Year Question Practice	10	f	2
187	84	Test	10	f	2
188	85	Lecture	30	f	2
189	85	Practice	30	f	2
190	85	Revision	20	f	2
191	85	Previous Year Question Practice	10	f	2
192	85	Test	10	f	2
193	86	Lecture	30	f	2
194	86	Practice	30	f	2
195	86	Revision	20	f	2
196	86	Previous Year Question Practice	10	f	2
197	86	Test	10	f	2
198	87	Lecture	30	f	2
199	87	Practice	30	f	2
200	87	Revision	20	f	2
201	87	Previous Year Question Practice	10	f	2
202	87	Test	10	f	2
203	88	Lecture	30	f	2
204	88	Practice	30	f	2
205	88	Revision	20	f	2
206	88	Previous Year Question Practice	10	f	2
207	88	Test	10	f	2
208	89	Lecture	30	f	2
209	89	Practice	30	f	2
210	89	Revision	20	f	2
211	89	Previous Year Question Practice	10	f	2
212	89	Test	10	f	2
213	90	Lecture	30	f	2
214	90	Practice	30	f	2
215	90	Revision	20	f	2
216	90	Previous Year Question Practice	10	f	2
217	90	Test	10	f	2
218	91	Lecture	30	f	2
219	91	Practice	30	f	2
220	91	Revision	20	f	2
221	91	Previous Year Question Practice	10	f	2
222	91	Test	10	f	2
223	92	Lecture	30	f	2
224	92	Practice	30	f	2
225	92	Revision	20	f	2
226	92	Previous Year Question Practice	10	f	2
227	92	Test	10	f	2
228	93	Lecture	30	f	2
229	93	Practice	30	f	2
230	93	Revision	20	f	2
231	93	Previous Year Question Practice	10	f	2
232	93	Test	10	f	2
233	94	Lecture	30	f	2
234	94	Practice	20	f	2
235	94	Revision	20	f	2
236	94	Previous Year Question Practice	10	f	2
237	94	Test	10	f	2
238	95	Lecture	30	f	2
239	95	Practice	30	f	2
240	95	Revision	20	f	2
162	80	Lecture	30	t	2
163	80	Practice	30	t	2
166	80	Test	10	t	2
164	80	Revision	20	t	2
241	95	Previous Year Question Practice	10	f	2
242	95	Test	10	f	2
243	96	Lecture	30	f	2
244	96	Practice	30	f	2
245	96	Revision	20	f	2
246	96	Previous Year Question Practice	10	f	2
247	96	Test	10	f	2
248	97	Lecture	30	f	2
249	97	Practice	30	f	2
250	97	Revision	20	f	2
251	97	Previous Year Question Practice	10	f	2
252	97	Test	10	f	2
253	98	Lecture	30	f	2
254	98	Practice	30	f	2
255	98	Revision	20	f	2
256	98	Previous Year Question Practice	10	f	2
257	98	Test	10	f	2
258	99	Lecture	30	f	2
259	99	Practice	30	f	2
260	99	Revision	20	f	2
261	99	Previous Year Question Practice	10	f	2
262	99	Test	10	f	2
263	100	Lecture	30	f	2
264	100	Practice	30	f	2
265	100	Revision	20	f	2
266	100	Previous Year Question Practice	10	f	2
267	100	Test	10	f	2
268	101	Lecture	30	f	2
269	101	Practice	30	f	2
270	101	Revision	20	f	2
271	101	Previous Year Question Practice	10	f	2
272	101	Test	10	f	2
273	102	Practice	30	f	2
274	102	Lecture	30	f	2
275	102	Revision	20	f	2
276	102	Previous Year Question Practice	10	f	2
277	102	Test	10	f	2
278	103	Lecture	30	f	2
279	103	Practice	30	f	2
280	103	Revision	20	f	2
281	103	Previous Year Question Practice	10	f	2
282	103	Test	10	f	2
283	104	Lecture	30	f	2
284	104	Practice	30	f	2
285	104	Revision	20	f	2
286	104	Previous Year Question Practice	10	f	2
287	104	Test	10	f	2
288	105	Lecture	30	f	2
289	105	Practice	30	f	2
290	105	Revision	20	f	2
291	105	Previous Year Question Practice	10	f	2
292	105	Test	10	f	2
293	106	Lecture	30	f	2
294	106	Practice	30	f	2
295	106	Revision	20	f	2
296	106	Previous Year Question Practice	10	f	2
297	106	Test	10	f	2
298	107	Lecture	30	f	2
299	107	Practice	30	f	2
300	107	Revision	20	f	2
301	107	Previous Year Question Practice	10	f	2
302	107	Test	10	f	2
303	108	Lecture	30	f	2
304	108	Practice	30	f	2
305	108	Revision	20	f	2
306	108	Previous Year Question Practice	10	f	2
307	108	Test	10	f	2
13	46	Revision	20	t	2
308	109	Lecture 	30	f	2
309	109	Practice	30	f	2
310	109	Revision	20	f	2
311	109	Previous Year Question Practice	10	f	2
312	109	Test	10	f	2
313	110	Lecture	30	f	2
314	110	Practice	30	f	2
315	110	Revision	20	f	2
316	110	Previous Year Question Practice	10	f	2
317	110	Test	10	f	2
318	111	Lecture	30	f	2
319	111	Practice	30	f	2
320	111	Revision	20	f	2
321	111	Previous Year Question Practice	10	f	2
322	111	Test	10	f	2
323	112	Lecture	30	f	2
324	112	Practice	30	f	2
325	112	Revision	20	f	2
326	112	Previous Year Question Practice	10	f	2
327	112	Test	10	f	2
328	113	Lecture	30	f	2
329	113	Practice	30	f	2
330	113	Revision	20	f	2
331	113	Previous Year Question Practice	10	f	2
332	113	Test	10	f	2
333	114	Lecture	30	f	2
334	114	Practice	30	f	2
335	114	Revision	20	f	2
336	114	Previous Year Question Practice	10	f	2
337	114	Test	10	f	2
338	115	Lecture	30	f	2
339	115	Practice	30	f	2
340	115	Revision	20	f	2
341	115	Previous Year Question Practice	10	f	2
342	115	Test	10	f	2
343	116	Lecture	30	f	2
344	116	Practice	30	f	2
345	116	Revision	20	f	2
346	116	Previous Year Question Practice	10	f	2
347	116	Test	10	f	2
348	117	Lecture	30	f	2
349	117	Practice	30	f	2
350	117	Revision	20	f	2
351	117	Previous Year Question Practice	10	f	2
352	117	Test	10	f	2
165	80	Previous Year Question Practice	10	t	2
24	48	Previous Year Question Practice	10	t	2
\.


--
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subjects (id, name, weightage, user_id) FROM stdin;
4	physics	33	\N
5	chemistry	33	\N
6	biology	33	\N
7	physics	33	1
8	chemistry	33	1
9	Biology	33	1
10	Physics	25	2
11	Chemistry	25	2
15	Botany	25	2
16	Zoology	25	2
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, email) FROM stdin;
1	rajcoder129	$2b$10$uZ2wQGDdFWaWiUDqdAZkbu9I/bG/5sDzTgWA5EUM.211xxqmOALG2	hemrajlalawat52@gmail.com
2	jeetu_pro	$2b$10$mSgHwIrXkKnBqiQ.zt14HeLVYD7vjbf7f/kW2pK8aIhi3OTQpIf3u	jeetubairwa5212@gmail.com
\.


--
-- Name: chapters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chapters_id_seq', 119, true);


--
-- Name: components_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.components_id_seq', 352, true);


--
-- Name: subjects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subjects_id_seq', 18, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: chapters chapters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_pkey PRIMARY KEY (id);


--
-- Name: components components_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.components
    ADD CONSTRAINT components_pkey PRIMARY KEY (id);


--
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: chapters chapters_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);


--
-- Name: chapters chapters_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: components components_chapter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.components
    ADD CONSTRAINT components_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES public.chapters(id);


--
-- Name: components components_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.components
    ADD CONSTRAINT components_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: subjects subjects_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

