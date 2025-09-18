CREATE TABLE "empresas" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "empresas_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "phones" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "phones_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"price" integer NOT NULL,
	"stock" integer NOT NULL,
	"empresa" varchar(255) DEFAULT 'Sin empresa' NOT NULL
);
