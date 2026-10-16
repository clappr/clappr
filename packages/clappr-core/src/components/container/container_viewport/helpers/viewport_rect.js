// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

export const copyRect = rect => rect && { ...rect }

export const copyViewport = viewport => viewport && { ...viewport, margin: { ...viewport.margin } }

export const sameRect = (a, b) =>
  a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
