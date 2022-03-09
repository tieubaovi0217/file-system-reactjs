import File from './File';
import Folder from './Folder';
import * as moment from 'moment';
import prettyBytes from 'pretty-bytes';
import { useState, useEffect } from 'react';

import './ResourceManagement.css';

import { Row, Button, Breadcrumb, Input, Spin, message } from 'antd';
import useFetch from '../../hooks/useFetch';

import { ArrowLeftOutlined } from '@ant-design/icons';

const { Search } = Input;

const ResourceManagement = () => {
  const { sendRequest, isFetching: isLoading } = useFetch();

  const [resources, setResources] = useState([]);
  const [resourcesPath, setResourcesPath] = useState(
    process.env.REACT_APP_RESOURCES_ROOT_FOLDER_PATH,
  );

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_URL}/${resourcesPath}`;

    sendRequest(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${
          localStorage.getItem('token') ? localStorage.getItem('token') : ''
        }`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((data) => {
        const newResources = data.map((resource) => {
          return {
            isFile: resource.isFile,
            isDirectDirectory: resource.isDirectDirectory,
            name: resource.name,
            ext: resource.ext,
            resourceSize: prettyBytes(resource.resourceSize),
            lastModified: moment(resource.lastModified).format(
              'DD/MM/YYYY HH:mm:ss',
            ),
          };
        });
        setResources(newResources);
      })
      .catch((err) => {
        console.log(err);
        message.error(err.message, 1);
      });
  }, [sendRequest, resourcesPath]);

  const cols = resources.map((resource) => {
    //TODO: map icons to resources
    //TODO: long resource name
    if (resource.isFile)
      return <File fileName={resource.name} onDoubleClick={() => {}} />;

    return (
      <Folder folderName={resource.name} onDoubleClick={setResourcesPath} />
    );
  });

  const onSearch = (value) => {
    console.log(value);
  };

  const backButtonClickHandler = () => {
    const updatedResourcesPath = resourcesPath.split('/');
    updatedResourcesPath.pop();

    setResourcesPath(updatedResourcesPath.join('/'));
  };

  const breadcrumbItems = resourcesPath
    .split('/')
    .map((resourcePath, index) => {
      return <Breadcrumb.Item key={index + 1}>{resourcePath}</Breadcrumb.Item>;
    });

  return (
    <section className="resources">
      <div className="resources__header">
        <Button
          shape="circle"
          onClick={backButtonClickHandler}
          disabled={
            resourcesPath === process.env.REACT_APP_RESOURCES_ROOT_FOLDER_PATH
          }
        >
          <ArrowLeftOutlined />
        </Button>
        <Breadcrumb className="resources__path">{breadcrumbItems}</Breadcrumb>
        <Search
          className="resources__search-bar"
          placeholder="Search file"
          allowClear
          onSearch={onSearch}
          style={{ width: 240 }}
        />
      </div>
      {!isLoading && <Row gutter={[8, 12]}>{cols}</Row>}
      {isLoading && (
        <div className="resources__spinner">
          <Spin size="large" />
        </div>
      )}
    </section>
  );
};

export default ResourceManagement;
