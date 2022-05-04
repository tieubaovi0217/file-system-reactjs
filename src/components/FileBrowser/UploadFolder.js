import './styles.css';
import { useState } from 'react';
import { Button } from 'antd';
import { FolderAddOutlined } from '@ant-design/icons';

import ModalForm from './ModalForm';

const UploadFolder = ({ onCreateFolder }) => {
  const [isShowNewFolderForm, setIsShowNewFolderForm] = useState(false);

  const handleNewFolderFormOpen = () => {
    setIsShowNewFolderForm(true);
  };

  const handleFormCancel = () => {
    setIsShowNewFolderForm(false);
  };

  const handleCreateFolder = async (folderName) => {
    if (folderName.trim().length === 0) return handleFormCancel();
    onCreateFolder(folderName);
  };

  return (
    <div>
      <Button
        type="text"
        icon={<FolderAddOutlined className="font-125" />}
        onClick={handleNewFolderFormOpen}
      >
        New folder
      </Button>
      <ModalForm
        modalTitle="Create a new folder"
        inputPlaceholder="Folder name"
        defaultValue=""
        onConfirm={handleCreateFolder}
        isVisible={isShowNewFolderForm}
        onCancel={handleFormCancel}
      />
    </div>
  );
};

export default UploadFolder;
