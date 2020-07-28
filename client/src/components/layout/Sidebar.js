import React, { Fragment, useContext, useEffect } from 'react';
import ProjectContext from '../../context/project/projectContext';
import AuthContext from '../../context/auth/authContext';
import UpdateProject from '../projects/UpdateProject';
const Sidebar = () => {
  const projectContext = useContext(ProjectContext);
  const authContext = useContext(AuthContext);
  const { project, loadCurProject } = projectContext;
  const { user, loading } = authContext;

  useEffect(() => {
    console.log(user);
    if (user) {
      loadCurProject(user.projectId);
    }
    // eslint-disable-next-line
  }, [loading]);

  return (
    <Fragment>
      <div className='sidebar-container'>
        <div>{project && project.title}</div>
        <div>{project && project.description}</div>
        <ul>
          <li>Roadmap</li>
          <li>Dashboard</li>
        </ul>
        <UpdateProject />
      </div>
    </Fragment>
  );
};

export default Sidebar;
