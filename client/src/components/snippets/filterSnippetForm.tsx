import React from "react";
import { connect } from "react-redux";
import { fetchSnippets } from "../../store/actions";
import { State, User } from "../../store/types";
import { isEmpty } from "../../lib/lib";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";

// TODO:
// 1. Populate user names (values as userID) for a drop-down
// 2. Populate current week, can go from 1-52

interface FilterSnippetFormProps {
  fetchSnippets: (filter?: any) => void;

  user: User | null;
  users: any;
  selectedTeam: string | null;
}

const FilterSnippetForm = (props: FilterSnippetFormProps) => {
  // Setup Materialize CSS for 'select' dropdowns
  setTimeout(() => {
    let selects = document.querySelectorAll("select");
    M.FormSelect.init(selects, {});
  }, 500);

  // Populate user names for filter dropdown
  const renderUsers = () => {
    if (props.user && !isEmpty(props.user)) {
      let users = props.users;
      return Object.keys(users).map(k => {
        return (
          <option key={k} value={users[k].googleId}>
            {users[k].firstName + " " + users[k].lastName}
          </option>
        );
      });
    }
  };

  // Formik hook setup
  const formik = useFormik({
    // Initial values
    initialValues: {
      user: "",
      week: moment().format("W")
    },
    // Validate form schema
    validationSchema: Yup.object({
      user: Yup.string(),
      week: Yup.string()
    }),
    // Handle submit
    onSubmit: (values, actions) => {
      setTimeout(() => {
        props.fetchSnippets({
          userSelected: values.user,
          weekSelected: values.week,
          teamSelected: props.selectedTeam
        });
        actions.setSubmitting(false);
        //actions.setSubmitting(false);
        //alert("User = " + values.user + " Week = " + values.week);
      }, 500);
    }
  });

  return (
    <div className="row">
      <form onSubmit={formik.handleSubmit}>
        <div className="right input-field col m3 s12">
          <button type="submit" className="btn waves-effect waves-light blue">
            Filter
            <i className="material-icons right">send</i>
          </button>
        </div>
        <div className="right input-field col m3 s12">
          <select id="user" value="" {...formik.getFieldProps("user")}>
            <option value="">All Users</option>
            {renderUsers()}
          </select>
        </div>
        <div className="right input-field col m3 s12">
          <input
            type="number"
            id="week"
            min="1"
            max="52"
            {...formik.getFieldProps("week")}
          ></input>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  return {
    user: state.user,
    users: state.users,
    selectedTeam: state.selectedTeam
  };
};

const mapDispatchToProps = () => {
  return {
    fetchSnippets
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps()
)(FilterSnippetForm);
