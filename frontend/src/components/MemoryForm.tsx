import React, { useState } from 'react'
import { Button, Form, Input, Modal, TextArea } from 'semantic-ui-react'
import { Memory } from '../types/Memory'

interface MemoryFormProps {
  handleSubmitForm: Function
  formMemory?: Memory
  triggerText: string
}
function MemoryForm({
  handleSubmitForm,
  formMemory,
  triggerText
}: MemoryFormProps) {
  const [open, setOpen] = React.useState(false)
  const [memory, setMemory] = useState<Memory>(
    formMemory || {
      memoryId: '-1',
      createdAt: '',
      title: '',
      caption: '',
      feeling: '',
      location: ''
    }
  )
  const [errors, setErrors] = useState({
    title: false,
    caption: false,
    feeling: false,
    location: false
  })
  const handleChange = (
    e: any,
    { name, value }: { name: string; value: string }
  ) => {
    setMemory({ ...memory, [name]: value })
    setErrors({ ...errors, [name]: !value })
  }

  const handleSubmit = () => {
    if (validateForm()) {
      handleSubmitForm(memory)
      setOpen(false)
    }
  }

  const validateForm = () => {
    const formErrors = {
      title: false,
      caption: false,
      feeling: false,
      location: false
    }
    if (memory.title.length === 0) formErrors.title = true
    if (memory.caption.length === 0) formErrors.caption = true
    if (memory.location.length === 0) formErrors.location = true
    if (memory.feeling.length === 0) formErrors.feeling = true
    setErrors(formErrors)
    return (
      !formErrors.title &&
      !formErrors.caption &&
      !formErrors.feeling &&
      !formErrors.location
    )
  }
  const errorContent = 'This field is required'

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button floated="right">{triggerText}</Button>}
    >
      <Modal.Header>
        {memory.memoryId !== '-1' ? 'Edit Memory' : 'Create New Memory'}
      </Modal.Header>
      <Modal.Content form>
        <Form>
          <Form.Group widths="equal">
            <Form.Field
              required
              id="form-input-control-title"
              control={Input}
              label="Title"
              placeholder="i.e: Traveling To Alexandria"
              name="title"
              value={memory.title}
              onChange={handleChange}
              error={errors.title && errorContent}
            />
            <Form.Field
              required
              id="form-input-control-location"
              control={Input}
              label="Location"
              placeholder="i.e: Alexandria"
              name="location"
              value={memory.location}
              onChange={handleChange}
              error={errors.location && errorContent}
            />
            <Form.Field
              required
              id="form-input-control-feeling"
              control={Input}
              label="Feeling"
              placeholder="i.e: Happy"
              name="feeling"
              value={memory.feeling}
              onChange={handleChange}
              error={errors.feeling && errorContent}
            />
          </Form.Group>
          <Form.Field
            required
            id="form-textarea-control-caption"
            control={TextArea}
            label="Caption"
            placeholder="Memory Description"
            name="caption"
            value={memory.caption}
            onChange={handleChange}
            error={errors.caption && errorContent}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          content="Submit"
          labelPosition="right"
          icon="checkmark"
          onClick={() => handleSubmit()}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default MemoryForm
