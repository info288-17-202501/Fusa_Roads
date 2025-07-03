--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-03 11:09:04

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
--SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 16389)
-- Name: calles; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA calles;


ALTER SCHEMA calles OWNER TO postgres;

--
-- TOC entry 7 (class 2615 OID 16390)
-- Name: pia; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA pia;


ALTER SCHEMA pia OWNER TO postgres;

--
-- TOC entry 8 (class 2615 OID 16391)
-- Name: pmr; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA pmr;


ALTER SCHEMA pmr OWNER TO postgres;

--
-- TOC entry 244 (class 1255 OID 24786)
-- Name: solo_un_pmr_activo(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.solo_un_pmr_activo() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.activo THEN
        UPDATE pmr.pmr
        SET activo = FALSE
        WHERE id <> NEW.id;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.solo_un_pmr_activo() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16392)
-- Name: calle_localidad; Type: TABLE; Schema: calles; Owner: postgres
--

CREATE TABLE calles.calle_localidad (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    id_localidad integer NOT NULL
);


ALTER TABLE calles.calle_localidad OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16395)
-- Name: calle_localidad_id_seq; Type: SEQUENCE; Schema: calles; Owner: postgres
--

CREATE SEQUENCE calles.calle_localidad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE calles.calle_localidad_id_seq OWNER TO postgres;

--
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 221
-- Name: calle_localidad_id_seq; Type: SEQUENCE OWNED BY; Schema: calles; Owner: postgres
--

ALTER SEQUENCE calles.calle_localidad_id_seq OWNED BY calles.calle_localidad.id;


--
-- TOC entry 222 (class 1259 OID 16396)
-- Name: ciudad; Type: TABLE; Schema: calles; Owner: postgres
--

CREATE TABLE calles.ciudad (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    id_pais integer NOT NULL
);


ALTER TABLE calles.ciudad OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16399)
-- Name: ciudad_id_seq; Type: SEQUENCE; Schema: calles; Owner: postgres
--

CREATE SEQUENCE calles.ciudad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE calles.ciudad_id_seq OWNER TO postgres;

--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 223
-- Name: ciudad_id_seq; Type: SEQUENCE OWNED BY; Schema: calles; Owner: postgres
--

ALTER SEQUENCE calles.ciudad_id_seq OWNED BY calles.ciudad.id;


--
-- TOC entry 224 (class 1259 OID 16400)
-- Name: localidad; Type: TABLE; Schema: calles; Owner: postgres
--

CREATE TABLE calles.localidad (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    id_ciudad integer NOT NULL,
    flg_vigencia character varying(1) DEFAULT 'S'::character varying NOT NULL
);


ALTER TABLE calles.localidad OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16404)
-- Name: localidad_id_seq; Type: SEQUENCE; Schema: calles; Owner: postgres
--

CREATE SEQUENCE calles.localidad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE calles.localidad_id_seq OWNER TO postgres;

--
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 225
-- Name: localidad_id_seq; Type: SEQUENCE OWNED BY; Schema: calles; Owner: postgres
--

ALTER SEQUENCE calles.localidad_id_seq OWNED BY calles.localidad.id;


--
-- TOC entry 226 (class 1259 OID 16405)
-- Name: pais; Type: TABLE; Schema: calles; Owner: postgres
--

CREATE TABLE calles.pais (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE calles.pais OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16408)
-- Name: pais_id_seq; Type: SEQUENCE; Schema: calles; Owner: postgres
--

CREATE SEQUENCE calles.pais_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE calles.pais_id_seq OWNER TO postgres;

--
-- TOC entry 5032 (class 0 OID 0)
-- Dependencies: 227
-- Name: pais_id_seq; Type: SEQUENCE OWNED BY; Schema: calles; Owner: postgres
--

ALTER SEQUENCE calles.pais_id_seq OWNED BY calles.pais.id;


--
-- TOC entry 228 (class 1259 OID 16409)
-- Name: seccion_calle; Type: TABLE; Schema: calles; Owner: postgres
--

CREATE TABLE calles.seccion_calle (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    id_calle_localidad integer NOT NULL,
    id_tipo_via integer NOT NULL
);


ALTER TABLE calles.seccion_calle OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16412)
-- Name: seccion_calle_id_seq; Type: SEQUENCE; Schema: calles; Owner: postgres
--

CREATE SEQUENCE calles.seccion_calle_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE calles.seccion_calle_id_seq OWNER TO postgres;

--
-- TOC entry 5033 (class 0 OID 0)
-- Dependencies: 229
-- Name: seccion_calle_id_seq; Type: SEQUENCE OWNED BY; Schema: calles; Owner: postgres
--

ALTER SEQUENCE calles.seccion_calle_id_seq OWNED BY calles.seccion_calle.id;


--
-- TOC entry 230 (class 1259 OID 16413)
-- Name: tipo_via; Type: TABLE; Schema: calles; Owner: postgres
--

CREATE TABLE calles.tipo_via (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE calles.tipo_via OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16416)
-- Name: tipo_via_id_seq; Type: SEQUENCE; Schema: calles; Owner: postgres
--

CREATE SEQUENCE calles.tipo_via_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE calles.tipo_via_id_seq OWNER TO postgres;

--
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 231
-- Name: tipo_via_id_seq; Type: SEQUENCE OWNED BY; Schema: calles; Owner: postgres
--

ALTER SEQUENCE calles.tipo_via_id_seq OWNED BY calles.tipo_via.id;


--
-- TOC entry 240 (class 1259 OID 24731)
-- Name: detalle; Type: TABLE; Schema: pia; Owner: postgres
--

CREATE TABLE pia.detalle (
    id_pia_video integer NOT NULL,
    id_tipo_vehiculo integer NOT NULL,
    id_hora integer NOT NULL,
    cantidad_vehiculos integer NOT NULL,
    duracion double precision NOT NULL
);


ALTER TABLE pia.detalle OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 24691)
-- Name: pia; Type: TABLE; Schema: pia; Owner: postgres
--

CREATE TABLE pia.pia (
    id integer NOT NULL,
    codigo_pia character varying(50) NOT NULL
);


ALTER TABLE pia.pia OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 24690)
-- Name: pia_id_seq; Type: SEQUENCE; Schema: pia; Owner: postgres
--

CREATE SEQUENCE pia.pia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE pia.pia_id_seq OWNER TO postgres;

--
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 234
-- Name: pia_id_seq; Type: SEQUENCE OWNED BY; Schema: pia; Owner: postgres
--

ALTER SEQUENCE pia.pia_id_seq OWNED BY pia.pia.id;


--
-- TOC entry 239 (class 1259 OID 24715)
-- Name: pia_videos; Type: TABLE; Schema: pia; Owner: postgres
--

CREATE TABLE pia.pia_videos (
    id integer NOT NULL,
    id_pia integer NOT NULL,
    id_video integer NOT NULL,
    nombre_json character varying(50) NOT NULL,
    duracion double precision NOT NULL,
    timestamp_inicio timestamp without time zone NOT NULL
);


ALTER TABLE pia.pia_videos OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 24714)
-- Name: pia_videos_id_seq; Type: SEQUENCE; Schema: pia; Owner: postgres
--

CREATE SEQUENCE pia.pia_videos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE pia.pia_videos_id_seq OWNER TO postgres;

--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 238
-- Name: pia_videos_id_seq; Type: SEQUENCE OWNED BY; Schema: pia; Owner: postgres
--

ALTER SEQUENCE pia.pia_videos_id_seq OWNED BY pia.pia_videos.id;


--
-- TOC entry 232 (class 1259 OID 16428)
-- Name: tipo_vehiculo; Type: TABLE; Schema: pia; Owner: postgres
--

CREATE TABLE pia.tipo_vehiculo (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    flg_vigencia character varying(1) DEFAULT 'S'::character varying NOT NULL
);


ALTER TABLE pia.tipo_vehiculo OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16432)
-- Name: tipo_vehiculo_id_seq; Type: SEQUENCE; Schema: pia; Owner: postgres
--

CREATE SEQUENCE pia.tipo_vehiculo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE pia.tipo_vehiculo_id_seq OWNER TO postgres;

--
-- TOC entry 5037 (class 0 OID 0)
-- Dependencies: 233
-- Name: tipo_vehiculo_id_seq; Type: SEQUENCE OWNED BY; Schema: pia; Owner: postgres
--

ALTER SEQUENCE pia.tipo_vehiculo_id_seq OWNED BY pia.tipo_vehiculo.id;


--
-- TOC entry 237 (class 1259 OID 24698)
-- Name: videos; Type: TABLE; Schema: pia; Owner: postgres
--

CREATE TABLE pia.videos (
    id integer NOT NULL,
    codigo_video character varying(50) NOT NULL,
    id_ciudad integer NOT NULL,
    id_tipo_via integer NOT NULL,
    fecha_grabacion timestamp without time zone NOT NULL
);


ALTER TABLE pia.videos OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 24697)
-- Name: videos_id_seq; Type: SEQUENCE; Schema: pia; Owner: postgres
--

CREATE SEQUENCE pia.videos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE pia.videos_id_seq OWNER TO postgres;

--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 236
-- Name: videos_id_seq; Type: SEQUENCE OWNED BY; Schema: pia; Owner: postgres
--

ALTER SEQUENCE pia.videos_id_seq OWNED BY pia.videos.id;


--
-- TOC entry 242 (class 1259 OID 24759)
-- Name: pmr; Type: TABLE; Schema: pmr; Owner: postgres
--

CREATE TABLE pmr.pmr (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(50) NOT NULL,
    fecha_creacion timestamp without time zone NOT NULL,
    id_localidad integer NOT NULL,
    activo boolean DEFAULT false
);


ALTER TABLE pmr.pmr OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 24758)
-- Name: pmr_id_seq; Type: SEQUENCE; Schema: pmr; Owner: postgres
--

CREATE SEQUENCE pmr.pmr_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE pmr.pmr_id_seq OWNER TO postgres;

--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 241
-- Name: pmr_id_seq; Type: SEQUENCE OWNED BY; Schema: pmr; Owner: postgres
--

ALTER SEQUENCE pmr.pmr_id_seq OWNED BY pmr.pmr.id;


--
-- TOC entry 243 (class 1259 OID 24770)
-- Name: uso; Type: TABLE; Schema: pmr; Owner: postgres
--

CREATE TABLE pmr.uso (
    id_pmr integer NOT NULL,
    id_pia_video integer NOT NULL
);


ALTER TABLE pmr.uso OWNER TO postgres;

--
-- TOC entry 4804 (class 2604 OID 16437)
-- Name: calle_localidad id; Type: DEFAULT; Schema: calles; Owner: postgres
--

ALTER TABLE ONLY calles.calle_localidad ALTER COLUMN id SET DEFAULT nextval('calles.calle_localidad_id_seq'::regclass);


--
-- TOC entry 4805 (class 2604 OID 16438)
-- Name: ciudad id; Type: DEFAULT; Schema: calles; Owner: postgres
--

ALTER TABLE ONLY calles.ciudad ALTER COLUMN id SET DEFAULT nextval('calles.ciudad_id_seq'::regclass);


--
-- TOC entry 4806 (class 2604 OID 16439)
-- Name: localidad id; Type: DEFAULT; Schema: calles; Owner: postgres
--

ALTER TABLE ONLY calles.localidad ALTER COLUMN id SET DEFAULT nextval('calles.localidad_id_seq'::regclass);


--
-- TOC entry 4808 (class 2604 OID 16440)
-- Name: pais id; Type: DEFAULT; Schema: calles; Owner: postgres
--

ALTER TABLE ONLY calles.pais ALTER COLUMN id SET DEFAULT nextval('calles.pais_id_seq'::regclass);


--
-- TOC entry 4809 (class 2604 OID 16441)
-- Name: seccion_calle id; Type: DEFAULT; Schema: calles; Owner: postgres
--

ALTER TABLE ONLY calles.seccion_calle ALTER COLUMN id SET DEFAULT nextval('calles.seccion_calle_id_seq'::regclass);


--
-- TOC entry 4810 (class 2604 OID 16442)
-- Name: tipo_via id; Type: DEFAULT; Schema: calles; Owner: postgres
--

ALTER TABLE ONLY calles.tipo_via ALTER COLUMN id SET DEFAULT nextval('calles.tipo_via_id_seq'::regclass);


--
-- TOC entry 4813 (class 2604 OID 24694)
-- Name: pia id; Type: DEFAULT; Schema: pia; Owner: postgres
--

ALTER TABLE ONLY pia.pia ALTER COLUMN id SET DEFAULT nextval('pia.pia_id_seq'::regclass);


--
-- TOC entry 4815 (class 2604 OID 24718)
-- Name: pia_videos id; Type: DEFAULT; Schema: pia; Owner: postgres
--

ALTER TABLE ONLY pia.pia_videos ALTER COLUMN id SET DEFAULT nextval('pia.pia_videos_id_seq'::regclass);


--
-- TOC entry 4811 (class 2604 OID 16445)
-- Name: tipo_vehiculo id; Type: DEFAULT; Schema: pia; Owner: postgres
--

ALTER TABLE ONLY pia.tipo_vehiculo ALTER COLUMN id SET DEFAULT nextval('pia.tipo_vehiculo_id_seq'::regclass);


--
-- TOC entry 4814 (class 2604 OID 24701)
-- Name: videos id; Type: DEFAULT; Schema: pia; Owner: postgres
--

ALTER TABLE ONLY pia.videos ALTER COLUMN id SET DEFAULT nextval('pia.videos_id_seq'::regclass);


--
-- TOC entry 4816 (class 2604 OID 24762)
-- Name: pmr id; Type: DEFAULT; Schema: pmr; Owner: postgres
--

ALTER TABLE ONLY pmr.pmr ALTER COLUMN id SET DEFAULT nextval('pmr.pmr_id_seq'::regclass);


--
-- TOC entry 5000 (class 0 OID 16392)
-- Dependencies: 220
-- Data for Name: calle_localidad; Type: TABLE DATA; Schema: calles; Owner: postgres
--

COPY calles.calle_localidad (id, nombre, id_localidad) FROM stdin;
1	arauco	1
2	san martín	1
3	carlos anwandter	1
4	picarte	1
5	cochrane	1
6	pudeto	1
7	simpson	1
8	aníbal pinto	1
9	caupolicán	1
10	janequeo	1
11	baquedano	1
12	yerbas buenas	1
13	sotomayor	1
14	calle sin nombre 1	1
15	isla teja	1
16	maipú	1
17	san pedro	1
18	los robles	1
19	beauchef	1
20	o'higgins	1
21	ramírez	1
22	avenida alemania	1
23	circunvalación	1
24	pedro montt	1
25	matta	1
26	san carlos	1
27	independencia	1
28	calle sin nombre 2	1
29	lautaro	1
\.


--
-- TOC entry 5002 (class 0 OID 16396)
-- Dependencies: 222
-- Data for Name: ciudad; Type: TABLE DATA; Schema: calles; Owner: postgres
--

COPY calles.ciudad (id, nombre, id_pais) FROM stdin;
3	Valdivia	3
6	Paris	4
7	Marsella	4
8	Niza	4
9	Paillaco	3
10	Osorno	3
\.


--
-- TOC entry 5004 (class 0 OID 16400)
-- Dependencies: 224
-- Data for Name: localidad; Type: TABLE DATA; Schema: calles; Owner: postgres
--

COPY calles.localidad (id, nombre, id_ciudad, flg_vigencia) FROM stdin;
1	centrooo	3	S
2	test paris	6	S
3	test paillaco	9	S
\.


--
-- TOC entry 5006 (class 0 OID 16405)
-- Dependencies: 226
-- Data for Name: pais; Type: TABLE DATA; Schema: calles; Owner: postgres
--

COPY calles.pais (id, nombre) FROM stdin;
3	Chile
4	Francia
\.


--
-- TOC entry 5008 (class 0 OID 16409)
-- Dependencies: 228
-- Data for Name: seccion_calle; Type: TABLE DATA; Schema: calles; Owner: postgres
--

COPY calles.seccion_calle (id, nombre, id_calle_localidad, id_tipo_via) FROM stdin;
1	s3	1	8
2	s2	2	4
3	s2	3	9
4	s2	4	12
5	s3	5	6
6	s1	6	4
7	s1	7	11
8	s1	8	3
9	s2	9	7
10	s2	10	5
11	s3	11	9
12	s1	5	9
13	s2	12	6
14	s1	1	3
15	s2	13	11
16	s3	8	8
17	s1	14	2
18	s2	15	9
19	s3	4	5
20	s3	16	9
21	s1	9	12
22	s2	17	7
23	s2	11	12
24	s2	18	11
25	s2	16	5
26	s2	19	9
27	s2	20	10
28	s2	21	1
29	s2	22	3
30	s3	23	6
31	s2	24	4
32	s1	25	6
33	s3	6	8
34	s2	8	6
35	s3	12	12
36	s2	6	9
37	s2	26	5
38	s2	13	2
39	s1	27	8
40	s2	28	9
41	s2	15	12
42	s1	12	4
43	s3	27	6
44	s2	15	3
45	s2	16	4
46	s1	19	7
47	s2	15	4
48	s3	29	4
\.


--
-- TOC entry 5010 (class 0 OID 16413)
-- Dependencies: 230
-- Data for Name: tipo_via; Type: TABLE DATA; Schema: calles; Owner: postgres
--

COPY calles.tipo_via (id, nombre) FROM stdin;
1	vía expresa con locomoción colectiva
2	vía expresa sin locomoción colectiva
3	vía troncal con locomoción colectiva
4	vía troncal sin locomoción colectiva
5	vía colectora con locomoción colectiva
6	vía colectora sin locomoción colectiva
7	vía de servicio con locomoción colectiva
8	vía de servicio sin locomoción colectiva
9	vía local con locomoción colectiva
10	vía local sin locomoción colectiva
11	autopista
12	no definido
\.


--
-- TOC entry 5020 (class 0 OID 24731)
-- Dependencies: 240
-- Data for Name: detalle; Type: TABLE DATA; Schema: pia; Owner: postgres
--

COPY pia.detalle (id_pia_video, id_tipo_vehiculo, id_hora, cantidad_vehiculos, duracion) FROM stdin;
1	3	14	12	59.39
1	4	14	5	59.39
2	3	21	5	19.876544
2	4	21	1	19.876544
2	4	22	4	39.513456
2	3	22	7	39.513456
\.


--
-- TOC entry 5015 (class 0 OID 24691)
-- Dependencies: 235
-- Data for Name: pia; Type: TABLE DATA; Schema: pia; Owner: postgres
--

COPY pia.pia (id, codigo_pia) FROM stdin;
1	pia_20250527_134442_686a61
2	pia_20250527_134442_2f5edd
\.


--
-- TOC entry 5019 (class 0 OID 24715)
-- Dependencies: 239
-- Data for Name: pia_videos; Type: TABLE DATA; Schema: pia; Owner: postgres
--

COPY pia.pia_videos (id, id_pia, id_video, nombre_json, duracion, timestamp_inicio) FROM stdin;
1	1	1	prueba.mp4	59.39	2025-06-26 21:01:01.362499
2	2	2	prueba.mp4	59.39	2025-06-26 21:01:01.397429
\.


--
-- TOC entry 5012 (class 0 OID 16428)
-- Dependencies: 232
-- Data for Name: tipo_vehiculo; Type: TABLE DATA; Schema: pia; Owner: postgres
--

COPY pia.tipo_vehiculo (id, nombre, flg_vigencia) FROM stdin;
1	bus	S
2	bicycle	S
3	car	S
4	truck	S
5	motorcycle	S
9	borrar	S
\.


--
-- TOC entry 5017 (class 0 OID 24698)
-- Dependencies: 237
-- Data for Name: videos; Type: TABLE DATA; Schema: pia; Owner: postgres
--

COPY pia.videos (id, codigo_video, id_ciudad, id_tipo_via, fecha_grabacion) FROM stdin;
1	20250527_134442_686a61	3	11	2025-06-17 14:30:00.654321
2	20250527_134442_2f5edd	3	1	2025-06-17 21:59:40.123456
\.


--
-- TOC entry 5022 (class 0 OID 24759)
-- Dependencies: 242
-- Data for Name: pmr; Type: TABLE DATA; Schema: pmr; Owner: postgres
--

COPY pmr.pmr (id, nombre, descripcion, fecha_creacion, id_localidad, activo) FROM stdin;
1	PMR edit test	pmr descripcion test	2025-06-27 02:54:59.871335	2	f
15	test pmr julio actualizado	descripcion	2025-07-01 19:42:27.222846	1	f
8	PMR 5	Proyecto 5	2025-06-27 03:50:07.032387	1	f
12	PMR TEST 1	breve descripcion pmr test 1	2025-06-28 19:17:15.366093	1	f
21	ASDSAD	ADSASDAD	2025-07-02 16:47:43.467188	1	t
\.


--
-- TOC entry 5023 (class 0 OID 24770)
-- Dependencies: 243
-- Data for Name: uso; Type: TABLE DATA; Schema: pmr; Owner: postgres
--

COPY pmr.uso (id_pmr, id_pia_video) FROM stdin;
12	1
12	2
8	2
8	1
1	2
1	1
15	2
21	2
\.


--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 221
-- Name: calle_localidad_id_seq; Type: SEQUENCE SET; Schema: calles; Owner: postgres
--

SELECT pg_catalog.setval('calles.calle_localidad_id_seq', 29, true);


--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 223
-- Name: ciudad_id_seq; Type: SEQUENCE SET; Schema: calles; Owner: postgres
--

SELECT pg_catalog.setval('calles.ciudad_id_seq', 10, true);


--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 225
-- Name: localidad_id_seq; Type: SEQUENCE SET; Schema: calles; Owner: postgres
--

SELECT pg_catalog.setval('calles.localidad_id_seq', 3, true);


--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 227
-- Name: pais_id_seq; Type: SEQUENCE SET; Schema: calles; Owner: postgres
--

SELECT pg_catalog.setval('calles.pais_id_seq', 4, true);


--
-- TOC entry 5044 (class 0 OID 0)
-- Dependencies: 229
-- Name: seccion_calle_id_seq; Type: SEQUENCE SET; Schema: calles; Owner: postgres
--

SELECT pg_catalog.setval('calles.seccion_calle_id_seq', 48, true);


--
-- TOC entry 5045 (class 0 OID 0)
-- Dependencies: 231
-- Name: tipo_via_id_seq; Type: SEQUENCE SET; Schema: calles; Owner: postgres
--

SELECT pg_catalog.setval('calles.tipo_via_id_seq', 12, true);


--
-- TOC entry 5046 (class 0 OID 0)
-- Dependencies: 234
-- Name: pia_id_seq; Type: SEQUENCE SET; Schema: pia; Owner: postgres
--

SELECT pg_catalog.setval('pia.pia_id_seq', 2, true);


--
-- TOC entry 5047 (class 0 OID 0)
-- Dependencies: 238
-- Name: pia_videos_id_seq; Type: SEQUENCE SET; Schema: pia; Owner: postgres
--

SELECT pg_catalog.setval('pia.pia_videos_id_seq', 2, true);


--
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 233
-- Name: tipo_vehiculo_id_seq; Type: SEQUENCE SET; Schema: pia; Owner: postgres
--

SELECT pg_catalog.setval('pia.tipo_vehiculo_id_seq', 9, true);


--
-- TOC entry 5049 (class 0 OID 0)
-- Dependencies: 236
-- Name: videos_id_seq; Type: SEQUENCE SET; Schema: pia; Owner: postgres
--

SELECT pg_catalog.setval('pia.videos_id_seq', 2, true);


--
-- TOC entry 5050 (class 0 OID 0)
-- Dependencies: 241
-- Name: pmr_id_seq; Type: SEQUENCE SET; Schema: pmr; Owner: postgres
--

SELECT pg_catalog.setval('pmr.pmr_id_seq', 21, true);


--
-- TOC entry 4819 (class 2606 OID 16448)
-- Name: calle_localidad calle_localidad_pkey; Type: CONSTRAINT; Schema: calles; Owner: postgres
--

ALTER TABLE ONLY calles.calle_localidad
    ADD CONSTRAINT calle_localidad_pkey PRIMARY KEY (id);


--
-- TOC entry 4821 (class 2606 OID 16450)
-- Name: ciudad ciudad_pkey; Type: CONSTRAINT; Schema: calles; Owner: postgres
--

ALTER TABLE ONLY calles.ciudad
    ADD CONSTRAINT ciudad_pkey PRIMARY KEY (id);


--
-- TOC entry 4823 (class 2606 OID 16452)
-- Name: localidad localidad_pkey; Type: CONSTRAINT; Schema: calles; Owner: postgres
--

ALTER TABLE ONLY calles.localidad
    ADD CONSTRAINT localidad_pkey PRIMARY KEY (id);


--
-- TOC entry 4825 (class 2606 OID 16454)
-- Name: pais pais_pkey; Type: CONSTRAINT; Schema: calles; Owner: postgres
--

ALTER TABLE ONLY calles.pais
    ADD CONSTRAINT pais_pkey PRIMARY KEY (id);


--
-- TOC entry 4827 (class 2606 OID 16456)
-- Name: seccion_calle seccion_calle_pkey; Type: CONSTRAINT; Schema: calles; Owner: postgres
--

ALTER TABLE ONLY calles.seccion_calle
    ADD CONSTRAINT seccion_calle_pkey PRIMARY KEY (id);


--
-- TOC entry 4829 (class 2606 OID 16458)
-- Name: tipo_via tipo_via_pkey; Type: CONSTRAINT; Schema: calles; Owner: postgres
--

ALTER TABLE ONLY calles.tipo_via
    ADD CONSTRAINT tipo_via_pkey PRIMARY KEY (id);


--
-- TOC entry 4833 (class 2606 OID 24696)
-- Name: pia pia_pkey; Type: CONSTRAINT; Schema: pia; Owner: postgres
--

ALTER TABLE ONLY pia.pia
    ADD CONSTRAINT pia_pkey PRIMARY KEY (id);


--
-- TOC entry 4837 (class 2606 OID 24720)
-- Name: pia_videos pia_videos_pkey; Type: CONSTRAINT; Schema: pia; Owner: postgres
--

ALTER TABLE ONLY pia.pia_videos
    ADD CONSTRAINT pia_videos_pkey PRIMARY KEY (id);


--
-- TOC entry 4831 (class 2606 OID 16464)
-- Name: tipo_vehiculo tipo_vehiculo_pkey; Type: CONSTRAINT; Schema: pia; Owner: postgres
--

ALTER TABLE ONLY pia.tipo_vehiculo
    ADD CONSTRAINT tipo_vehiculo_pkey PRIMARY KEY (id);


--
-- TOC entry 4835 (class 2606 OID 24703)
-- Name: videos videos_pkey; Type: CONSTRAINT; Schema: pia; Owner: postgres
--

ALTER TABLE ONLY pia.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (id);


--
-- TOC entry 4839 (class 2606 OID 24764)
-- Name: pmr pmr_pkey; Type: CONSTRAINT; Schema: pmr; Owner: postgres
--

ALTER TABLE ONLY pmr.pmr
    ADD CONSTRAINT pmr_pkey PRIMARY KEY (id);


--
-- TOC entry 4854 (class 2620 OID 24787)
-- Name: pmr trg_solo_un_pmr_activo; Type: TRIGGER; Schema: pmr; Owner: postgres
--

CREATE TRIGGER trg_solo_un_pmr_activo BEFORE INSERT OR UPDATE ON pmr.pmr FOR EACH ROW EXECUTE FUNCTION public.solo_un_pmr_activo();


--
-- TOC entry 4840 (class 2606 OID 16467)
-- Name: calle_localidad calle_localidad_id_localidad_fkey; Type: FK CONSTRAINT; Schema: calles; Owner: postgres
--

ALTER TABLE ONLY calles.calle_localidad
    ADD CONSTRAINT calle_localidad_id_localidad_fkey FOREIGN KEY (id_localidad) REFERENCES calles.localidad(id);


--
-- TOC entry 4841 (class 2606 OID 16472)
-- Name: ciudad ciudad_id_pais_fkey; Type: FK CONSTRAINT; Schema: calles; Owner: postgres
--

ALTER TABLE ONLY calles.ciudad
    ADD CONSTRAINT ciudad_id_pais_fkey FOREIGN KEY (id_pais) REFERENCES calles.pais(id);


--
-- TOC entry 4842 (class 2606 OID 16477)
-- Name: localidad localidad_id_ciudad_fkey; Type: FK CONSTRAINT; Schema: calles; Owner: postgres
--

ALTER TABLE ONLY calles.localidad
    ADD CONSTRAINT localidad_id_ciudad_fkey FOREIGN KEY (id_ciudad) REFERENCES calles.ciudad(id);


--
-- TOC entry 4843 (class 2606 OID 16482)
-- Name: seccion_calle seccion_calle_id_calle_localidad_fkey; Type: FK CONSTRAINT; Schema: calles; Owner: postgres
--

ALTER TABLE ONLY calles.seccion_calle
    ADD CONSTRAINT seccion_calle_id_calle_localidad_fkey FOREIGN KEY (id_calle_localidad) REFERENCES calles.calle_localidad(id);


--
-- TOC entry 4844 (class 2606 OID 16487)
-- Name: seccion_calle seccion_calle_id_tipo_via_fkey; Type: FK CONSTRAINT; Schema: calles; Owner: postgres
--

ALTER TABLE ONLY calles.seccion_calle
    ADD CONSTRAINT seccion_calle_id_tipo_via_fkey FOREIGN KEY (id_tipo_via) REFERENCES calles.tipo_via(id);


--
-- TOC entry 4849 (class 2606 OID 24734)
-- Name: detalle detalle_id_pia_video_fkey; Type: FK CONSTRAINT; Schema: pia; Owner: postgres
--

ALTER TABLE ONLY pia.detalle
    ADD CONSTRAINT detalle_id_pia_video_fkey FOREIGN KEY (id_pia_video) REFERENCES pia.pia_videos(id);


--
-- TOC entry 4850 (class 2606 OID 24739)
-- Name: detalle detalle_id_tipo_vehiculo_fkey; Type: FK CONSTRAINT; Schema: pia; Owner: postgres
--

ALTER TABLE ONLY pia.detalle
    ADD CONSTRAINT detalle_id_tipo_vehiculo_fkey FOREIGN KEY (id_tipo_vehiculo) REFERENCES pia.tipo_vehiculo(id);


--
-- TOC entry 4847 (class 2606 OID 24721)
-- Name: pia_videos pia_videos_id_pia_fkey; Type: FK CONSTRAINT; Schema: pia; Owner: postgres
--

ALTER TABLE ONLY pia.pia_videos
    ADD CONSTRAINT pia_videos_id_pia_fkey FOREIGN KEY (id_pia) REFERENCES pia.pia(id);


--
-- TOC entry 4848 (class 2606 OID 24726)
-- Name: pia_videos pia_videos_id_video_fkey; Type: FK CONSTRAINT; Schema: pia; Owner: postgres
--

ALTER TABLE ONLY pia.pia_videos
    ADD CONSTRAINT pia_videos_id_video_fkey FOREIGN KEY (id_video) REFERENCES pia.videos(id);


--
-- TOC entry 4845 (class 2606 OID 24704)
-- Name: videos videos_id_ciudad_fkey; Type: FK CONSTRAINT; Schema: pia; Owner: postgres
--

ALTER TABLE ONLY pia.videos
    ADD CONSTRAINT videos_id_ciudad_fkey FOREIGN KEY (id_ciudad) REFERENCES calles.ciudad(id);


--
-- TOC entry 4846 (class 2606 OID 24709)
-- Name: videos videos_id_tipo_via_fkey; Type: FK CONSTRAINT; Schema: pia; Owner: postgres
--

ALTER TABLE ONLY pia.videos
    ADD CONSTRAINT videos_id_tipo_via_fkey FOREIGN KEY (id_tipo_via) REFERENCES calles.tipo_via(id);


--
-- TOC entry 4851 (class 2606 OID 24765)
-- Name: pmr pmr_id_localidad_fkey; Type: FK CONSTRAINT; Schema: pmr; Owner: postgres
--

ALTER TABLE ONLY pmr.pmr
    ADD CONSTRAINT pmr_id_localidad_fkey FOREIGN KEY (id_localidad) REFERENCES calles.localidad(id);


--
-- TOC entry 4852 (class 2606 OID 24778)
-- Name: uso uso_id_pia_video_fkey; Type: FK CONSTRAINT; Schema: pmr; Owner: postgres
--

ALTER TABLE ONLY pmr.uso
    ADD CONSTRAINT uso_id_pia_video_fkey FOREIGN KEY (id_pia_video) REFERENCES pia.pia_videos(id);


--
-- TOC entry 4853 (class 2606 OID 24773)
-- Name: uso uso_id_pmr_fkey; Type: FK CONSTRAINT; Schema: pmr; Owner: postgres
--

ALTER TABLE ONLY pmr.uso
    ADD CONSTRAINT uso_id_pmr_fkey FOREIGN KEY (id_pmr) REFERENCES pmr.pmr(id);


-- Completed on 2025-07-03 11:09:05

--
-- PostgreSQL database dump complete
--

