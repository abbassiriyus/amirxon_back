
CREATE TABLE "news" (
"newsid" SERIAL PRIMARY KEY,
"title_news" TEXT NOT NULL,
"desc_news" TEXT NOT NULL,
"image_news" TEXT,
"syscreatedatutc" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);
CREATE TABLE "file" (
"fileid" SERIAL PRIMARY KEY,
"file_title" TEXT NOT NULL,
"file_image" TEXT,
"file1" TEXT,
"syscreatedatutc" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);
CREATE TABLE "foto" (
"fotoid" SERIAL PRIMARY KEY,
"foto_title" TEXT NOT NULL,
"syscreatedatutc" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp

);
CREATE TABLE "fotoimg" (
"fotoimgid" SERIAL PRIMARY KEY,
"images" TEXT,
"fotoid" integer,
FOREIGN KEY (fotoid) REFERENCES foto (fotoid),
"syscreatedatutc" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp

);
CREATE TABLE "help" (
"helpid" SERIAL PRIMARY KEY,
"help_title" TEXT NOT NULL,
"syscreatedatutc" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp

);
CREATE TABLE "helpimg" (
"helpimgid" SERIAL PRIMARY KEY,
"images" TEXT ,
"helpid" integer NOT NULL,
FOREIGN KEY (helpid) REFERENCES help (helpid),
"syscreatedatutc" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE TABLE "video" (
"videoid" SERIAL PRIMARY KEY,
"video_link" TEXT NOT NULL,
"video_title" TEXT NOT NULL,
"syscreatedatutc" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);
