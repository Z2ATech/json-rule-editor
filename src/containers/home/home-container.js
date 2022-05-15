import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { login } from '../../actions/app'
import { uploadRuleset } from '../../actions/ruleset'
import { TitlePanel } from '../../components/panel/panel'
import Button from '../../components/button/button'
import { createHashHistory } from 'history'
import FooterLinks from '../../components/footer/footer'
import footerLinks from '../../data-objects/footer-links.json'
import { includes } from 'lodash/collection'
import Notification from '../../components/notification/notification'
import {
  RULE_AVAILABLE_UPLOAD,
  RULE_UPLOAD_ERROR,
} from '../../constants/messages'
import { updateCode, updateToken } from '../../actions/auth'
import { getAuthTokens, readRule } from '../../utils/apiservice'
import { addRuleset, clearRuleset } from '../../actions/ruleset'
// import store from '../../store'

function readFile(file, cb) {
  var reader = new FileReader()
  reader.onload = () => {
    try {
      cb(JSON.parse(reader.result), file.name)
    } catch (e) {
      cb(undefined, undefined, e.message)
    }
  }
  return reader.readAsText(file)
}

class HomeContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uploadedFilesCount: 0,
      files: [],
      ruleset: [],
      uploadError: false,
      fileExist: false,
      message: {},
    }
    this.drop = this.drop.bind(this)
    this.allowDrop = this.allowDrop.bind(this)
    this.printFile = this.printFile.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
    this.chooseDirectory = this.chooseDirectory.bind(this)
  }

  allowDrop(e) {
    e.preventDefault()
  }
  //these should be in an env file or similar
  loginUrl =
    'https://ggd-employee-identities-dev.auth.us-east-2.amazoncognito.com/login?client_id=5dncsjfvgeuu9qmot7rgg9o202&response_type=code&scope=email+openid+profile&redirect_uri=http://localhost:8080'
  readRulesUrl =
    'https://3bdgfnrxf1.execute-api.us-east-2.amazonaws.com/dev/crudrule'
  getTokenUrl =
    'https://ggd-employee-identities-dev.auth.us-east-2.amazoncognito.com/oauth2/token'

  async setRule(initial) {
    try {
      const { data } = await readRule(
        this.readRulesUrl,
        localStorage.getItem('id_token'),
      )
      // load rules into ui
      for (let i = 0; i < data.length; i++) {
        if (i === 0 && initial === true) {
          const rule = data[i]
          this.props.addRuleset(
            rule.rule_name,
            rule.attributes,
            rule.decisions,
            initial,
          )
        } else {
          const rule = data[i]
          this.props.addRuleset(
            rule.rule_name,
            rule.attributes,
            rule.decisions,
            false,
          )
        }
      }
    } catch (e) {
      if (e.code === 'ERR_BAD_REQUEST') {
        localStorage.removeItem('id_token')
        window.location.href = this.loginUrl
      }
    }
  }

  async componentDidMount() {
    await this.props.clearRuleset()
    const urlData = window.location.search

    if (localStorage.getItem('id_token')) {
      await this.setRule(true)
    } else {
      if (urlData.includes('code')) {
        const urlParams = new URLSearchParams(location.search)
        const code = urlParams.get('code')
        //check if token is functional
        try {
          const { data } = await getAuthTokens(
            this.getTokenUrl,
            { code: code },
            'http://localhost:8080',
          )
          localStorage.setItem('id_token', data.id_token)
          this.props.updateToken(data.id_token) // this is not working properly. Using localstore for temp fix
          urlParams.delete('code')
          await this.setRule(true)
        } catch (e) {
          if (!e.code === 'ERR_BAD_REQUEST') {
            // eslint-disable-next-line no-console
            console.log(e)
          }
          window.location.href = this.loginUrl
        }
      } else {
        window.location.href = this.loginUrl
      }
    }
  }

  printFile(file, name, error) {
    if (error) {
      this.setState({
        uploadError: true,
        fileExist: false,
        message: RULE_UPLOAD_ERROR,
      })
    } else {
      const isFileAdded =
        this.state.files.some(fname => fname === name) ||
        includes(this.props.rulenames, file.name)
      if (!isFileAdded) {
        const files = this.state.files.concat([name])
        const ruleset = this.state.ruleset.concat(file)
        this.setState({ files, ruleset, fileExist: false })
      } else {
        const message = {
          ...RULE_AVAILABLE_UPLOAD,
          heading: RULE_AVAILABLE_UPLOAD.heading.replace('<name>', file.name),
        }
        this.setState({ fileExist: true, message })
      }
    }
  }

  uploadFile(items, index) {
    const file = items[index].getAsFile()
    readFile(file, this.printFile)
  }

  uploadDirectory(item) {
    var dirReader = item.createReader()
    const print = this.printFile
    dirReader.readEntries(function (entries) {
      for (let j = 0; j < entries.length; j++) {
        let subItem = entries[j]
        if (subItem.isFile) {
          subItem.file(file => {
            readFile(file, print)
          })
        }
      }
    })
  }

  // this method is not required. its to select files from local disk.
  /* chooseFile() {
    const file = document.getElementById("uploadFile");
    if (file && file.files) {
      for (let i = 0; i < file.files.length; i++) {
        readFile(file.files[i], this.printFile);
      }
    }
   } */

  chooseDirectory(e) {
    const files = e.target.files
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type === 'application/json') {
          readFile(files[i], this.printFile)
        }
      }
    }
  }

  drop(e) {
    e.preventDefault()
    const items = e.dataTransfer.items
    if (items) {
      for (let i = 0; i < items.length; i++) {
        let item = items[i].webkitGetAsEntry()
        if (item.isFile) {
          this.uploadFile(items, i)
        } else if (item.isDirectory) {
          this.uploadDirectory(item)
        }
      }
    }
  }

  handleUpload() {
    if (this.state.ruleset.length > 0) {
      this.props.uploadRuleset(this.state.ruleset)
      this.navigate('./ruleset')
    }
  }

  navigate(location) {
    const history = createHashHistory()
    this.props.login()
    history.push(location)
  }

  render() {
    const { fileExist, uploadError, message } = this.state
    const title = this.props.loggedIn ? 'Upload Rules' : 'Create / Upload Rules'
    return (
      <div className="home-container">
        <div className="single-panel-container">
          {(fileExist || uploadError) && (
            <Notification
              body={message.body}
              heading={message.heading}
              type={message.type}
            />
          )}
          <TitlePanel title={title} titleClass="fa fa-cloud-upload">
            <div className="upload-panel">
              <div
                className="drop-section"
                onDrop={this.drop}
                onDragOver={this.allowDrop}
              >
                <div>
                  <label htmlFor="uploadFile">
                    Choose Ruleset directory
                    <input
                      id="uploadFile"
                      type="file"
                      onChange={this.chooseDirectory}
                      webkitdirectory="true"
                      multiple
                    />
                  </label>{' '}
                  or Drop Files
                </div>
                {this.state.files.length > 0 && (
                  <div className="file-drop-msg">{`${this.state.files.length} json files are dropped!`}</div>
                )}
              </div>
            </div>
            <div className="btn-group">
              <Button
                label={'Upload'}
                onConfirm={this.handleUpload}
                classname="primary-btn"
                type="button"
              />
              {!this.props.loggedIn && (
                <Button
                  label={'Create'}
                  onConfirm={() => this.navigate('./create-ruleset')}
                  classname="primary-btn"
                  type="button"
                  disabled={this.state.files.length > 0}
                />
              )}
            </div>
          </TitlePanel>
        </div>
        {!this.props.loggedIn && (
          <div className="footer-container home-page">
            <FooterLinks links={footerLinks} />
          </div>
        )}
      </div>
    )
  }
}

HomeContainer.propTypes = {
  ruleset: PropTypes.array,
  uploadRuleset: PropTypes.func,
  login: PropTypes.func,
  updateCode: PropTypes.func,
  updateToken: PropTypes.func,
  addRuleset: PropTypes.func,
  clearRuleset: PropTypes.func,
  loggedIn: PropTypes.bool,
  rulenames: PropTypes.array,
}

HomeContainer.defaultProps = {
  rulenames: [],
  ruleset: [],
  uploadRuleset: () => false,
  login: () => false,
  updateCode: () => false,
  updateToken: () => false,
  addRuleset: () => false,
  removeRuleset: () => false,
  loggedIn: false,
}

const mapStateToProps = state => ({
  rulenames: state.ruleset.rulesets.map(r => r.name),
  loggedIn: state.app.loggedIn,
  code: state.app.code,
  token: state.app.token,
})

const mapDispatchToProps = dispatch => ({
  login: () => dispatch(login()),
  uploadRuleset: ruleset => dispatch(uploadRuleset(ruleset)),
  updateCode: code => dispatch(updateCode(code)),
  updateToken: token => dispatch(updateToken(token)),
  addRuleset: (name, attributes, decisions) =>
    dispatch(addRuleset(name, attributes, decisions)),
  clearRuleset: () => dispatch(clearRuleset()),
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer)
