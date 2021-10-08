import * as React from 'react'
import { Form, Button, Modal } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile } from '../api/memoris-api'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile
}

interface UploadAttachmentProps {
  memoryId: string
  auth: Auth
  refetchMemories: Function
}

interface UploadAttachmentState {
  file: any
  uploadState: UploadState
  open: boolean
}

export class UploadAttachment extends React.PureComponent<
  UploadAttachmentProps,
  UploadAttachmentState
> {
  state: UploadAttachmentState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    open: false
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(
        this.props.auth.getIdToken(),
        this.props.memoryId
      )

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)
      this.setState({ open: false })
      alert('File was uploaded!')
      this.props.refetchMemories()
    } catch (error) {
      let errorMessage = 'Failed to do something exceptional'
      if (error instanceof Error) {
        errorMessage = 'Could not upload a file: ' + error.message
      }
      alert(errorMessage)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <Modal
        onClose={() => this.setState({ open: false })}
        onOpen={() => this.setState({ open: true })}
        open={this.state.open}
        trigger={<Button>Upload Image</Button>}
      >
        <Modal.Header>Upload new image</Modal.Header>

        <Modal.Content form>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <label>File</label>
              <input
                type="file"
                accept="image/*"
                placeholder="Image to upload"
                onChange={this.handleFileChange}
              />
            </Form.Field>

            {this.renderButton()}
          </Form>
        </Modal.Content>
      </Modal>
    )
  }

  renderButton() {
    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && (
          <p>Uploading image metadata</p>
        )}
        {this.state.uploadState === UploadState.UploadingFile && (
          <p>Uploading file</p>
        )}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}
