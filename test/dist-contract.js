const { parse } = require('acorn')
const walk = require('acorn-walk')

function parseDist(code) {
  try {
    return parse(code, { ecmaVersion: 'latest', sourceType: 'module' })
  } catch (moduleError) {
    try {
      return parse(code, {
        ecmaVersion: 'latest',
        sourceType: 'script',
        allowReturnOutsideFunction: true
      })
    } catch {
      throw moduleError
    }
  }
}

function scanParams(params, note) {
  for (const param of params) {
    walk.simple(param, {
      AssignmentPattern(node) {
        note('default param', node)
      },
      RestElement(node) {
        note('rest param', node)
      }
    })
  }
}

function findPostEs5(code) {
  const ast = parseDist(code)
  const hits = []
  const note = (form, node) => {
    hits.push({ form, node })
  }

  walk.simple(ast, {
    ClassDeclaration(node) {
      note('class', node)
    },
    ClassExpression(node) {
      note('class', node)
    },
    ArrowFunctionExpression(node) {
      note('arrow', node)
      scanParams(node.params, note)
    },
    VariableDeclaration(node) {
      if (node.kind === 'const') note('const', node)
      if (node.kind === 'let') note('let', node)
    },
    TemplateLiteral(node) {
      note('template literal', node)
    },
    Property(node) {
      if (node.shorthand) note('shorthand', node)
    },
    FunctionDeclaration(node) {
      scanParams(node.params, note)
    },
    FunctionExpression(node) {
      scanParams(node.params, note)
    }
  })

  return hits
}

function expectEs5Syntax(code, label) {
  const forms = [...new Set(findPostEs5(code).map(hit => hit.form))]
  if (forms.length === 0) return
  throw new Error(`${label} contains ${forms.join(', ')}`)
}

function expectEs5Subclassable(Base, ctorArg) {
  function Es5Subclass(arg) {
    Base.call(this, arg)
  }
  Es5Subclass.prototype = Object.create(Base.prototype)
  Es5Subclass.prototype.constructor = Es5Subclass
  Object.setPrototypeOf(Es5Subclass, Base)

  expect(() => new Es5Subclass(ctorArg)).not.toThrow()
}

function expectSourcemapFromSrc(mapJson, label) {
  const map = typeof mapJson === 'string' ? JSON.parse(mapJson) : mapJson
  const sources = map.sources || []
  if (sources.some(source => String(source).includes('clappr-lib-chunk.js'))) {
    throw new Error(`${label} sourcemap still points at clappr-lib-chunk.js`)
  }
  if (!sources.some(source => /(^|[\\/])src[\\/]/.test(source))) {
    throw new Error(
      `${label} sourcemap has no src/ files (${sources.slice(0, 5).join(', ') || 'none'})`
    )
  }
}

module.exports = {
  expectEs5Syntax,
  expectEs5Subclassable,
  expectSourcemapFromSrc
}
