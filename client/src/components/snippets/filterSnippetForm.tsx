import React from "react";
import { connect } from "react-redux";
import { fetchSnippets, fetchUser } from "../../store/actions";
import { useFormik } from "formik";
import * as Yup from "yup";

// TODO:
// 1. Populate user names (values as userID) for a drop-down
// 2. Populate current week, can go from 1-52

interface FilterSnippetFormProps {
  fetchSnippets: (filter?: any) => void;
  //users: any;
  //week: any;
}

const FilterSnippetForm = (props: FilterSnippetFormProps) => {
  const formik = useFormik({
    // Initial values
    initialValues: {
      user: "",
      week: ""
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
          // ADD TEAM SELECTED FROM REDUX STORE LATER
          teamSelected: ""
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
          <select className="browser-default">
            <option>hi</option>
            <option>there</option>
          </select>
        </div>
        <div className="right input-field col m3 s12">
          <select className="browser-default">
            <option>hi</option>
            <option>there</option>
          </select>
        </div>
      </form>
    </div>
    /*
    <div className="row">
      <form className="col s6 offset-s6" onSubmit={formik.handleSubmit}>
        <div className="input-field col s5">
          <span className="#9e9e9e grey-text">User</span>
          <select
            id="user"
            className="browser-default"
            value=""
            {...formik.getFieldProps("user")}
          >
            <option value="">User</option>
            <option value="102961147317667963053" key={0}>
              Wan Ashraf
            </option>
            <option value="104593608638718033745" key={1}>
              Marc
            </option>
            <option value="106427510631496405227" key={2}>
              Joe
            </option>
          </select>
          <select id="week" className="browser-default" value="">
            <option>Sarah</option>
            <option> Khairunisa</option>
          </select>
          <button type="submit" className="btn waves-effect waves-light blue">
            Filter
            <i className="material-icons right">send</i>
          </button>
        </div>
      </form>
    </div>
  */
  );
};

const mapDispatchToProps = () => {
  return {
    fetchSnippets
  };
};

export default connect(null, mapDispatchToProps())(FilterSnippetForm);
