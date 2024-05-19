create database tasky;
use tasky;

create table users (
	id int primary key auto_increment,
    name varchar(25) not null,
    email varchar(50) unique not null,
    profile varchar(255) not null,
    password varchar(255) not null
) auto_increment = 1000;

create table board (
	id int primary key auto_increment,
    title varchar(25) not null
) auto_increment = 1000;

create table board_members (
    board_id int,
    user_id int,
    role varchar(25) default 'member',
    primary key (board_id, user_id),
    foreign key (board_id) references board(id) on delete cascade,
    foreign key (user_id) references users(id)
) auto_increment = 1000;

create table tasks (
	board_id int,
	id int primary key auto_increment,
    title varchar(25) not null,
    description varchar(255),
    status varchar(25) default "todo",
    foreign key (board_id) references board(id)
) auto_increment = 1000;

create table task_members (
	task_id int,
    user_id int,
    primary key (task_id, user_id)
    foreign key (task_id) references tasks(id),
	foreign key (user_id) references users(id)
);