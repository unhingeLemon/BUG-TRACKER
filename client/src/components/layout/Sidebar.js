import React, { Fragment, useContext, useEffect, useState } from 'react';
import ProjectContext from '../../context/project/projectContext';
import AuthContext from '../../context/auth/authContext';
import UpdateProject from '../projects/UpdateProject';
import AddPeople from '../projects/AddPeople';
import DeleteProject from '../projects/DeleteProject';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const projectContext = useContext(ProjectContext);
  const authContext = useContext(AuthContext);
  const {
    project,
    loadCurProject,
    deleteUsers,
    reqUser,
    getReqUser,
  } = projectContext;

  const { user, loading } = authContext;

  const [isOwner, setOwner] = useState(false);

  const deleteUser = (user) => {
    // This will delete the specific
    // element in an array
    const array = project.users;
    const index = array.indexOf(user);
    if (index > -1) {
      array.splice(index, 1);
    }

    deleteUsers(project._id, { users: array });
    getReqUser(user);
  };

  useEffect(() => {
    if (user) {
      if (user.projectId !== undefined && project === null) {
        loadCurProject(user.projectId);
      }

      if (project) {
        if (user._id === project.user) {
          setOwner(true);
        } else {
          setOwner(false);
        }
      }
    }
    // console.log(isOwner);
    /// IF THE DELETED USER HOLD THE PROJECT
    /// REMOVE IT.

    if (reqUser) {
      // console.log(reqUser);
      if (reqUser.projectId === project._id) {
        authContext.updateDeletedUser(reqUser._id, { projectId: null });
      }
    }

    // eslint-disable-next-line
  }, [loading, reqUser, project]);

  return (
    <Fragment>
      {project ? (
        <div className='sidebar-container'>
          <div>
            <i className='far fa-folder'></i>
            {project && project.title}
          </div>
          <div>{project && project.description}</div>

          {project && (
            <div className='sidebar-options'>
              <div>
                <Link to='/roadmap' className='sidebar-option-item'>
                  Roadmap
                </Link>
              </div>
              {isOwner && (
                <div>
                  <UpdateProject />
                </div>
              )}
              {isOwner && (
                <div>
                  <DeleteProject />
                </div>
              )}
              {isOwner && (
                <div>
                  <AddPeople />
                </div>
              )}
            </div>
          )}
          <div className='users-sidebar'>
            <div>
              <i className='fas fa-users'></i>
              People
            </div>

            <ul>
              {project &&
                isOwner &&
                project.users.map((user) => (
                  <li key={user}>
                    <div>{user}</div>
                    <i
                      className='fas fa-trash'
                      onClick={() => deleteUser(user)}
                    ></i>
                  </li>
                ))}

              {/* IF YOU DO NOT OWN THE PROJECT... */}

              {!isOwner &&
                project &&
                project.users.map((user) => (
                  <li key={user}>
                    <div>{user}</div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className='modal-bg clear-bg'>
          <div className='home-accent'></div>
          <div className='home-container'>
            <div className='home-brand'>
              <i className='fas fa-bug' />
              <div>Project Manager</div>
            </div>
            <div className='welcome-home'>
              WELCOME!
              <span>{user && user.name}</span>
            </div>
            <div>
              <Link className='auth-submit home-btn' to='/projects'>
                Click Here
              </Link>
              <div>To create or select a project</div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Sidebar;
