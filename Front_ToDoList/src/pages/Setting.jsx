import CIcon from "@coreui/icons-react";
import Header from "../components/header/Header";
import styles from "./pages_css/Setting.module.scss";
import { cilUser } from "@coreui/icons";

const Settings = () => {
  return (
    <>
      <Header />
      <div className='settingsContainer'>
          <div>
            <CIcon icon={cilUser} size="xxl"/>
          </div>
      </div>





      {/* Social media detail */}
      {/* <div className="row mb-5 gx-5">
      
        <div className="col-xxl-6">
          <div className="bg-secondary-soft px-4 py-5 rounded">
            <div className="row g-3">
              <h4 className="my-4">Change Password</h4>

              <div className="col-md-6">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Old password *
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="exampleInputPassword2" className="form-label">
                  New password *
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword2"
                />
              </div>

              <div className="col-md-12">
                <label htmlFor="exampleInputPassword3" className="form-label">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword3"
                />
              </div>
              <div className="gap-3 d-md-flex justify-content-md-end text-center">
                <button type="button" className="btn btn-danger btn-lg">
                  Delete profile
                </button>
                <button type="button" className="btn btn-primary btn-lg">
                  Update profile
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-6 mb-5 mb-xxl-0">
          <div className="bg-secondary-soft px-4 py-5 rounded">
            <div className="row g-3">
              <h4 className="mb-4 mt-0">Email</h4>

              <div className="col-md-6">
                <label className="form-label">
                  <i className="fab fa-fw fa-facebook me-2 text-facebook"></i>
                  Facebook *
                </label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue="http://www.facebook.com"
                />
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Settings;
