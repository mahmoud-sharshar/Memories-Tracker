import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import { Button, Grid, Header, Loader, Item, Label } from 'semantic-ui-react'

import {
  createMemory,
  deleteMemory,
  getMemories,
  patchMemory
} from '../api/memoris-api'
import Auth from '../auth/Auth'
import { CreateMemoryRequest } from '../types/CreateMemoryRequest'
import { Memory } from '../types/Memory'
import MemoryForm from './MemoryForm'
import { UploadAttachment } from './UploadAttachment'

interface MemoriesProps {
  auth: Auth
  history: History
}

interface MemoriesState {
  memories: Memory[]
  loadingMemories: boolean
}

export class Memories extends React.PureComponent<
  MemoriesProps,
  MemoriesState
> {
  state: MemoriesState = {
    memories: [],
    loadingMemories: true
  }

  onMemoryCreate = async (memory: CreateMemoryRequest) => {
    try {
      const newMemory = await createMemory(this.props.auth.getIdToken(), memory)
      this.setState({
        memories: [...this.state.memories, newMemory]
      })
    } catch {
      alert('Memory creation failed')
    }
  }

  onMemoryDelete = async (memoryId: string) => {
    try {
      this.setState({
        memories: this.state.memories.filter(
          (memory) => memory.memoryId !== memoryId
        )
      })
      await deleteMemory(this.props.auth.getIdToken(), memoryId)
    } catch {
      alert('Memory deletion failed')
    }
  }

  onMemoryEdit = async (memory: any) => {
    try {
      this.setState({
        memories: [
          memory,
          ...this.state.memories.filter((m) => m.memoryId !== memory.memoryId)
        ]
      })
      await patchMemory(this.props.auth.getIdToken(), memory.memoryId, memory)
    } catch {
      alert('Memory Edit failed')
    }
  }

  async componentDidMount() {
    this.fetchMemories()
  }

  fetchMemories = async () => {
    try {
      const memories = await getMemories(this.props.auth.getIdToken())
      this.setState({
        memories,
        loadingMemories: false
      })
    } catch (error) {
      let errorMessage = 'Failed to do something exceptional'
      if (error instanceof Error) {
        errorMessage = `Failed to fetch memories: ${error.message}`
      }
      alert(errorMessage)
    }
  }
  render() {
    return (
      <div>
        {this.renderCreateMemoryInput()}
        <Header as="h1">My Memories</Header>
        {this.renderMemorys()}
      </div>
    )
  }

  renderCreateMemoryInput() {
    return (
      <MemoryForm
        handleSubmitForm={this.onMemoryCreate}
        triggerText="Add New Memory"
      />
    )
  }

  renderMemorys() {
    if (this.state.loadingMemories) {
      return this.renderLoading()
    }

    return this.renderMemoriesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Memories
        </Loader>
      </Grid.Row>
    )
  }

  renderMemoriesList() {
    return (
      <Item.Group divided>
        {this.state.memories.map((memory, pos) => {
          return (
            <Item>
              {memory.attachmentUrl ? (
                <Item.Image src={memory.attachmentUrl} />
              ) : (
                <Item.Image>
                  {' '}
                  <UploadAttachment
                    auth={this.props.auth}
                    memoryId={memory.memoryId}
                    refetchMemories={this.fetchMemories}
                  />
                </Item.Image>
              )}

              <Item.Content>
                <Item.Header as="a">{memory.title}</Item.Header>
                <Item.Meta>
                  <span className="cinema">
                    {dateFormat(memory.createdAt, 'fullDate')}
                  </span>
                </Item.Meta>
                <Item.Description>{memory.caption}</Item.Description>
                <Item.Extra>
                  <Button
                    floated="right"
                    onClick={() => {
                      this.onMemoryDelete(memory.memoryId)
                    }}
                  >
                    {' '}
                    Delete Memory
                  </Button>
                  <MemoryForm
                    handleSubmitForm={this.onMemoryEdit}
                    formMemory={memory}
                    triggerText="Edit Memory"
                  />
                  <Label>In {memory.location}</Label>
                  <Label>Feels {memory.feeling}</Label>
                </Item.Extra>
              </Item.Content>
            </Item>
          )
        })}
      </Item.Group>
    )
  }
}
