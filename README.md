[![Build Status](https://travis-ci.org/Deadarius/SugoiOverflow.svg?branch=master)](https://travis-ci.org/Deadarius/SugoiOverflow)
[![Dependencies status](https://david-dm.org/Deadarius/SugoiOverflow.svg)](https://david-dm.org/Deadarius/SugoiOverflow)

[![Stories in Ready](https://badge.waffle.io/Deadarius/SugoiOverflow.png?label=ready&title=Ready)](https://waffle.io/Deadarius/SugoiOverflow)
[![Join the chat at https://gitter.im/Deadarius/SugoiOverflow](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Deadarius/SugoiOverflow?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
# SugoiOverflow
So much sugoi - it overflows

# Overview
SugoiOverflow was started as StackOverflow clone with focus on internal use by other companies. Hovewer it can perform as external Q & A system as well.
[See demo](http://sugoi-overflow.herokuapp.com/) - you can register and than use it as you like.

##Currently implemented features include:
- Questions and answers(surprisingly)
- Comments
- Active Directory integration
- Integrated Windows Authentication
- Tags suggestions based on question text's analysis
- Suggestions of people who can answer the question based on users who answered similar questions
- Avatars

##Features planned to be implemented in the nearest future:
- Mentioning
- Questions, answers and comments editing
- Moderation

#General direction of the project
It is planned to split project into separate packages which could be potentially replaced by other packages. E.g there will be separate server and client packages and most of the functionality will be implemented through plugin system. In short: Unix philosofy.

# For contributors
Please read the [contribution guide](./CONTRIBUTING.md)
