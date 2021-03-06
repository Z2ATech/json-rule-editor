import * as ActionTypes from '../actions/action-types'
import { cloneDeep } from 'lodash/lang'
import { findIndex } from 'lodash/array'

const initialState = {
  rulesets: [],
  activeRuleset: 0,
  updatedFlag: false,
  uploadedRules: [],
}

const replaceRulesetByIndex = (rulesets, targetset, index) => {
  return [...rulesets.slice(0, index), targetset, ...rulesets.slice(index + 1)]
}

function ruleset(state = initialState, action = '') {
  switch (action.type) {
    case ActionTypes.UPLOAD_RULESET: {
      const { ruleset } = action.payload
      const rulesets = state.rulesets.concat(ruleset)
      return {
        ...state,
        rulesets: cloneDeep(rulesets),
        uploadedRules: cloneDeep(rulesets),
      }
    }
    case ActionTypes.CLEAR_RULESETS: {
      return {
        ...state,
        rulesets: [],
      }
    }
    case ActionTypes.ADD_RULESET: {
      var rulset = ''
      const { initial } = action.payload
      const rulesets = !initial ? state.rulesets : []

      if (action.payload.attributes && action.payload.decisions) {
        const { name, attributes, decisions } = action.payload
        rulset = { name, attributes: attributes, decisions: decisions }
      } else {
        const { name } = action.payload
        rulset = { name, attributes: [], decisions: [] }
      }
      const count = rulesets.length === 0 ? 0 : rulesets.length
      return {
        ...state,
        rulesets: rulesets.concat(rulset),
        activeRuleset: count,
      }
    }

    case ActionTypes.REMOVE_RULESET: {
      if (action.payload.removeAll) {
        return {
          ...initialState,
        };
      } else if (action.payload.ruleSetIndex) {
        const updatedRulesets = state.rulesets.splice(
          action.payload.ruleSetIndex,
          1
        );
        return {
          ...state,
          rulesets: [...updatedRulesets],
          activeRuleset: state.rulesets.length,
        };
      }
      break;
    }
    
    case ActionTypes.UPDATE_RULESET_INDEX: {
      const { name } = action.payload
      const index = findIndex(state.rulesets, { name })
      return { ...state, activeRuleset: index }
    }

    case ActionTypes.ADD_DECISION: {
      const { condition } = action.payload
      const activeRuleSet = { ...state.rulesets[state.activeRuleset] }
      activeRuleSet.decisions = activeRuleSet.decisions.concat(condition)

      return {
        ...state,
        updatedFlag: true,
        rulesets: replaceRulesetByIndex(
          state.rulesets,
          activeRuleSet,
          state.activeRuleset,
        ),
      }
    }

    case ActionTypes.UPDATE_DECISION: {
      const { condition, decisionIndex } = action.payload
      const activeRuleSet = { ...state.rulesets[state.activeRuleset] }

      activeRuleSet.decisions[decisionIndex] = condition

      return {
        ...state,
        updatedFlag: true,
        rulesets: replaceRulesetByIndex(
          state.rulesets,
          activeRuleSet,
          state.activeRuleset,
        ),
      }
    }
    case ActionTypes.REMOVE_DECISION: {
      const { decisionIndex } = action.payload
      const activeRuleSet = { ...state.rulesets[state.activeRuleset] }

      activeRuleSet.decisions.splice(decisionIndex, 1)

      return {
        ...state,
        updatedFlag: true,
        rulesets: replaceRulesetByIndex(
          state.rulesets,
          activeRuleSet,
          state.activeRuleset,
        ),
      }
    }

    case ActionTypes.REMOVE_DECISIONS: {
      const { outcome } = action.payload
      const activeRuleSet = { ...state.rulesets[state.activeRuleset] }

      activeRuleSet.decisions = activeRuleSet.decisions.filter(
        decision => decision.event && decision.event.type !== outcome,
      )

      return {
        ...state,
        updatedFlag: true,
        rulesets: replaceRulesetByIndex(
          state.rulesets,
          activeRuleSet,
          state.activeRuleset,
        ),
      }
    }

    case ActionTypes.ADD_ATTRIBUTE: {
      const { attribute } = action.payload
      const activeRuleSet = { ...state.rulesets[state.activeRuleset] }
      activeRuleSet.attributes.push(attribute)

      return {
        ...state,
        updatedFlag: true,
        rulesets: replaceRulesetByIndex(
          state.rulesets,
          activeRuleSet,
          state.activeRuleset,
        ),
      }
    }

    case ActionTypes.UPDATE_ATTRIBUTE: {
      const { attribute, index } = action.payload
      const activeRuleSet = { ...state.rulesets[state.activeRuleset] }
      activeRuleSet.attributes.splice(index, 1, attribute)

      return {
        ...state,
        updatedFlag: true,
        rulesets: replaceRulesetByIndex(
          state.rulesets,
          activeRuleSet,
          state.activeRuleset,
        ),
      }
    }

    case ActionTypes.REMOVE_ATTRIBUTE: {
      const { index } = action.payload
      const activeRuleSet = { ...state.rulesets[state.activeRuleset] }
      activeRuleSet.attributes.splice(index, 1)

      return {
        ...state,
        updatedFlag: true,
        rulesets: replaceRulesetByIndex(
          state.rulesets,
          activeRuleSet,
          state.activeRuleset,
        ),
      }
    }

    case ActionTypes.RESET_ATTRIBUTE: {
      const activeRuleSet = { ...state.rulesets[state.activeRuleset] }
      if (
        state.uploadedRules[state.activeRuleset] &&
        state.uploadedRules[state.activeRuleset].attributes
      ) {
        activeRuleSet.attributes = cloneDeep(
          state.uploadedRules[state.activeRuleset].attributes,
        )

        return {
          ...state,
          rulesets: replaceRulesetByIndex(
            state.rulesets,
            activeRuleSet,
            state.activeRuleset,
          ),
        }
      }
      return { ...state }
    }

    case ActionTypes.RESET_DECISION: {
      const activeRuleSet = { ...state.rulesets[state.activeRuleset] }
      if (
        state.uploadedRules[state.activeRuleset] &&
        state.uploadedRules[state.activeRuleset].decisions
      ) {
        activeRuleSet.decisions = cloneDeep(
          state.uploadedRules[state.activeRuleset].decisions,
        )

        return {
          ...state,
          rulesets: replaceRulesetByIndex(
            state.rulesets,
            activeRuleSet,
            state.activeRuleset,
          ),
        }
      }
      return { ...state }
    }

    default:
      return { ...state }
  }
}

export default ruleset
