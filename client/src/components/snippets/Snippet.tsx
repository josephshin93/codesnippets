import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchSnippets } from "../../store/actions";
import { State, User, Snippet } from "../../store/types";
import { isEmpty } from "../../lib/lib";
