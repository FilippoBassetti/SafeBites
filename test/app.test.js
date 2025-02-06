// app.test.js
const request = require('supertest');
const express = require('express');
const app = require('./app');

test('app module should be defined', () => {
    expect(app).toBeDefined();
  });
  