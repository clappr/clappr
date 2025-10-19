# Clappr

An extensible, plugin-oriented, HTML5-first media player for the web.  
It provides a modular architecture to build powerful playback experiences with ease.

[![CI](https://github.com/clappr/clappr/actions/workflows/ci.yml/badge.svg)](https://github.com/clappr/clappr/actions/workflows/ci.yml)
[![Player Version](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/clappr/clappr/main/packages/player/package.json&query=$.version&label=Player%20Version&color=blue)](https://raw.githubusercontent.com/clappr/clappr/main/packages/player/package.json)
[![License](https://img.shields.io/github/license/clappr/clappr)](https://github.com/clappr/clappr/blob/main/LICENSE)
[![minified size](https://img.shields.io/bundlephobia/min/@clappr/player)](https://bundlephobia.com/package/@clappr/player)
[![jsDelivr monthly downloads](https://img.shields.io/jsdelivr/npm/hm/@clappr/player)](https://www.jsdelivr.com/package/npm/@clappr/player)

## Getting Started

Install via npm or yarn:

```bash
yarn add @clappr/player
```

## Project Structure

This repository uses a monorepo layout:

| Directory                                                        | Description                                                                                                                       |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [`/apps`](/apps/)                                                | Applications such as [clappr.io](http://clappr.io/) and documentation site                                                        |
| [`/packages`](/packages/)                                        | Core packages (e.g. `@clappr/player`, plugins, utilities)                                                                         |
| [`/packages/player`](/packages/player)                           | The main **Clappr Player** package. Exposes the public API and serves as the entry point for embedding the player in web apps.    |
| [`/packages/clappr-core`](/packages/clappr-core)                 | Contains the **core architecture** of the player — including components such as `Core`, `Container`, and `Playback` abstractions. |
| [`/packages/clappr-plugins`](/packages/clappr-plugins)           | Official **plugin collection**, providing ready-to-use extensions (e.g., UI features, analytics integrations).                    |
| [`/packages/clappr-zepto`](/packages/clappr-zepto)               | Lightweight **DOM utility layer**, a modernized fork of Zepto tailored for Clappr’s internal UI rendering.                        |
| [`/packages/hlsjs-playback`](/packages/hlsjs-playback)           | Playback module that adds support for **HLS streams** using [hls.js](https://github.com/video-dev/hls.js).                        |
| [`/packages/dash-shaka-playback`](/packages/dash-shaka-playback) | Playback module that enables **MPEG-DASH** streaming via [Shaka Player](https://github.com/google/shaka-player).                  |

## Documentation

For the latest guides, examples, and architecture overviews, visit the resources below:

- [**Getting Started**](./apps/clappr.io/docs/getting_started.md): quick setup and integration examples.
- [**Architecture Overview**](./apps/clappr.io/docs/architecture.md): explains how the player, core, containers, and plugins interact.
- [**Plugin Development Guide**](./apps/clappr.io/docs/guides/how_to_build_plugins.md): how to create and register custom plugins.
- [**Player API Reference**](./apps/clappr.io/docs/api.md): complete reference of all available Player methods and properties.
- [**Frequently Asked Questions**](./apps/clappr.io/docs/faq.md): answers to commonly asked questions about setup, configuration, and troubleshooting.
- [**Changelog**](https://github.com/clappr/clappr/releases): highlights of each version and breaking changes.

## Local Development

Clone the repository and run:

```bash
# Install dependencies
yarn install

# Start the development environment
yarn dev

# Open in your browser
http://localhost:8080
```

## Contributors

Thanks to all our amazing contributors! 🎉

<!-- readme: contributors -start -->
<table>
	<tbody>
		<tr>
            <td align="center">
                <a href="https://github.com/towerz">
                    <img src="https://avatars.githubusercontent.com/u/989801?v=4" width="100;" alt="towerz"/>
                    <br />
                    <sub><b>towerz</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/flavioribeiro">
                    <img src="https://avatars.githubusercontent.com/u/244265?v=4" width="100;" alt="flavioribeiro"/>
                    <br />
                    <sub><b>flavioribeiro</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/leandromoreira">
                    <img src="https://avatars.githubusercontent.com/u/55913?v=4" width="100;" alt="leandromoreira"/>
                    <br />
                    <sub><b>leandromoreira</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/joaopaulovieira">
                    <img src="https://avatars.githubusercontent.com/u/5631063?v=4" width="100;" alt="joaopaulovieira"/>
                    <br />
                    <sub><b>joaopaulovieira</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/tjenkinson">
                    <img src="https://avatars.githubusercontent.com/u/3259993?v=4" width="100;" alt="tjenkinson"/>
                    <br />
                    <sub><b>tjenkinson</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/jhonatangcavalcanti">
                    <img src="https://avatars.githubusercontent.com/u/14154066?v=4" width="100;" alt="jhonatangcavalcanti"/>
                    <br />
                    <sub><b>jhonatangcavalcanti</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/tchakabam">
                    <img src="https://avatars.githubusercontent.com/u/1480052?v=4" width="100;" alt="tchakabam"/>
                    <br />
                    <sub><b>tchakabam</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/kslimani">
                    <img src="https://avatars.githubusercontent.com/u/1758996?v=4" width="100;" alt="kslimani"/>
                    <br />
                    <sub><b>kslimani</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/thiagopnts">
                    <img src="https://avatars.githubusercontent.com/u/322239?v=4" width="100;" alt="thiagopnts"/>
                    <br />
                    <sub><b>thiagopnts</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/greenkeeperio-bot">
                    <img src="https://avatars.githubusercontent.com/u/14790466?v=4" width="100;" alt="greenkeeperio-bot"/>
                    <br />
                    <sub><b>greenkeeperio-bot</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/dayvson">
                    <img src="https://avatars.githubusercontent.com/u/59447?v=4" width="100;" alt="dayvson"/>
                    <br />
                    <sub><b>dayvson</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/leaofelipe">
                    <img src="https://avatars.githubusercontent.com/u/1847691?v=4" width="100;" alt="leaofelipe"/>
                    <br />
                    <sub><b>leaofelipe</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/pedrochamberlain">
                    <img src="https://avatars.githubusercontent.com/u/40682476?v=4" width="100;" alt="pedrochamberlain"/>
                    <br />
                    <sub><b>pedrochamberlain</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/bikegriffith">
                    <img src="https://avatars.githubusercontent.com/u/167782?v=4" width="100;" alt="bikegriffith"/>
                    <br />
                    <sub><b>bikegriffith</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/vagnervjs">
                    <img src="https://avatars.githubusercontent.com/u/1696024?v=4" width="100;" alt="vagnervjs"/>
                    <br />
                    <sub><b>vagnervjs</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/felipecesr">
                    <img src="https://avatars.githubusercontent.com/u/10980841?v=4" width="100;" alt="felipecesr"/>
                    <br />
                    <sub><b>felipecesr</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/barbosa">
                    <img src="https://avatars.githubusercontent.com/u/235208?v=4" width="100;" alt="barbosa"/>
                    <br />
                    <sub><b>barbosa</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/ronag">
                    <img src="https://avatars.githubusercontent.com/u/3065230?v=4" width="100;" alt="ronag"/>
                    <br />
                    <sub><b>ronag</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/davidjb">
                    <img src="https://avatars.githubusercontent.com/u/1002811?v=4" width="100;" alt="davidjb"/>
                    <br />
                    <sub><b>davidjb</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/paluh">
                    <img src="https://avatars.githubusercontent.com/u/190249?v=4" width="100;" alt="paluh"/>
                    <br />
                    <sub><b>paluh</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/andrefilimono">
                    <img src="https://avatars.githubusercontent.com/u/7794526?v=4" width="100;" alt="andrefilimono"/>
                    <br />
                    <sub><b>andrefilimono</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/NicholasAsimov">
                    <img src="https://avatars.githubusercontent.com/u/8828810?v=4" width="100;" alt="NicholasAsimov"/>
                    <br />
                    <sub><b>NicholasAsimov</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/gamtiq">
                    <img src="https://avatars.githubusercontent.com/u/1177323?v=4" width="100;" alt="gamtiq"/>
                    <br />
                    <sub><b>gamtiq</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/afonsocdaniel">
                    <img src="https://avatars.githubusercontent.com/u/1382338?v=4" width="100;" alt="afonsocdaniel"/>
                    <br />
                    <sub><b>afonsocdaniel</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/leftees">
                    <img src="https://avatars.githubusercontent.com/u/12038092?v=4" width="100;" alt="leftees"/>
                    <br />
                    <sub><b>leftees</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/hounvs">
                    <img src="https://avatars.githubusercontent.com/u/6434904?v=4" width="100;" alt="hounvs"/>
                    <br />
                    <sub><b>hounvs</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/ariselseng">
                    <img src="https://avatars.githubusercontent.com/u/445843?v=4" width="100;" alt="ariselseng"/>
                    <br />
                    <sub><b>ariselseng</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/guilhermebruzzi">
                    <img src="https://avatars.githubusercontent.com/u/1321766?v=4" width="100;" alt="guilhermebruzzi"/>
                    <br />
                    <sub><b>guilhermebruzzi</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/stanogurnik">
                    <img src="https://avatars.githubusercontent.com/u/2771618?v=4" width="100;" alt="stanogurnik"/>
                    <br />
                    <sub><b>stanogurnik</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/amanda-bmelo">
                    <img src="https://avatars.githubusercontent.com/u/48109161?v=4" width="100;" alt="amanda-bmelo"/>
                    <br />
                    <sub><b>amanda-bmelo</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/mrlika">
                    <img src="https://avatars.githubusercontent.com/u/1469266?v=4" width="100;" alt="mrlika"/>
                    <br />
                    <sub><b>mrlika</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/breim">
                    <img src="https://avatars.githubusercontent.com/u/4550114?v=4" width="100;" alt="breim"/>
                    <br />
                    <sub><b>breim</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/raphamorim">
                    <img src="https://avatars.githubusercontent.com/u/3630346?v=4" width="100;" alt="raphamorim"/>
                    <br />
                    <sub><b>raphamorim</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/sjlu">
                    <img src="https://avatars.githubusercontent.com/u/329917?v=4" width="100;" alt="sjlu"/>
                    <br />
                    <sub><b>sjlu</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/luanraithz">
                    <img src="https://avatars.githubusercontent.com/u/27583162?v=4" width="100;" alt="luanraithz"/>
                    <br />
                    <sub><b>luanraithz</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/rheber">
                    <img src="https://avatars.githubusercontent.com/u/7068967?v=4" width="100;" alt="rheber"/>
                    <br />
                    <sub><b>rheber</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/michaelcunningham19">
                    <img src="https://avatars.githubusercontent.com/u/10078342?v=4" width="100;" alt="michaelcunningham19"/>
                    <br />
                    <sub><b>michaelcunningham19</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/avreg">
                    <img src="https://avatars.githubusercontent.com/u/1052428?v=4" width="100;" alt="avreg"/>
                    <br />
                    <sub><b>avreg</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/LeonardoCardoso">
                    <img src="https://avatars.githubusercontent.com/u/1775157?v=4" width="100;" alt="LeonardoCardoso"/>
                    <br />
                    <sub><b>LeonardoCardoso</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/svanscho">
                    <img src="https://avatars.githubusercontent.com/u/7288358?v=4" width="100;" alt="svanscho"/>
                    <br />
                    <sub><b>svanscho</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/me-vlad">
                    <img src="https://avatars.githubusercontent.com/u/222185?v=4" width="100;" alt="me-vlad"/>
                    <br />
                    <sub><b>me-vlad</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/wahajdar">
                    <img src="https://avatars.githubusercontent.com/u/25760541?v=4" width="100;" alt="wahajdar"/>
                    <br />
                    <sub><b>wahajdar</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/argoilves">
                    <img src="https://avatars.githubusercontent.com/u/7804734?v=4" width="100;" alt="argoilves"/>
                    <br />
                    <sub><b>argoilves</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/alvynmcq">
                    <img src="https://avatars.githubusercontent.com/u/1619808?v=4" width="100;" alt="alvynmcq"/>
                    <br />
                    <sub><b>alvynmcq</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/RussCoder">
                    <img src="https://avatars.githubusercontent.com/u/18438165?v=4" width="100;" alt="RussCoder"/>
                    <br />
                    <sub><b>RussCoder</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/lucasrodcosta">
                    <img src="https://avatars.githubusercontent.com/u/2574399?v=4" width="100;" alt="lucasrodcosta"/>
                    <br />
                    <sub><b>lucasrodcosta</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/leticiafernandes">
                    <img src="https://avatars.githubusercontent.com/u/13765802?v=4" width="100;" alt="leticiafernandes"/>
                    <br />
                    <sub><b>leticiafernandes</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/cursoragent">
                    <img src="https://avatars.githubusercontent.com/u/199161495?v=4" width="100;" alt="cursoragent"/>
                    <br />
                    <sub><b>cursoragent</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/paulocesarjr">
                    <img src="https://avatars.githubusercontent.com/u/13860683?v=4" width="100;" alt="paulocesarjr"/>
                    <br />
                    <sub><b>paulocesarjr</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/luzeduardo">
                    <img src="https://avatars.githubusercontent.com/u/770092?v=4" width="100;" alt="luzeduardo"/>
                    <br />
                    <sub><b>luzeduardo</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/otmjka">
                    <img src="https://avatars.githubusercontent.com/u/5286446?v=4" width="100;" alt="otmjka"/>
                    <br />
                    <sub><b>otmjka</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/hexray-newbee">
                    <img src="https://avatars.githubusercontent.com/u/15082228?v=4" width="100;" alt="hexray-newbee"/>
                    <br />
                    <sub><b>hexray-newbee</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/derrod">
                    <img src="https://avatars.githubusercontent.com/u/3123295?v=4" width="100;" alt="derrod"/>
                    <br />
                    <sub><b>derrod</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/gitter-badger">
                    <img src="https://avatars.githubusercontent.com/u/8518239?v=4" width="100;" alt="gitter-badger"/>
                    <br />
                    <sub><b>gitter-badger</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/seanhussey">
                    <img src="https://avatars.githubusercontent.com/u/10438?v=4" width="100;" alt="seanhussey"/>
                    <br />
                    <sub><b>seanhussey</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/rolandstarke">
                    <img src="https://avatars.githubusercontent.com/u/5196813?v=4" width="100;" alt="rolandstarke"/>
                    <br />
                    <sub><b>rolandstarke</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/rcmachado">
                    <img src="https://avatars.githubusercontent.com/u/141832?v=4" width="100;" alt="rcmachado"/>
                    <br />
                    <sub><b>rcmachado</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Niko78">
                    <img src="https://avatars.githubusercontent.com/u/17108017?v=4" width="100;" alt="Niko78"/>
                    <br />
                    <sub><b>Niko78</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/MartinKolarik">
                    <img src="https://avatars.githubusercontent.com/u/6192491?v=4" width="100;" alt="MartinKolarik"/>
                    <br />
                    <sub><b>MartinKolarik</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/MTRNord">
                    <img src="https://avatars.githubusercontent.com/u/1374914?v=4" width="100;" alt="MTRNord"/>
                    <br />
                    <sub><b>MTRNord</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/jussike">
                    <img src="https://avatars.githubusercontent.com/u/7323729?v=4" width="100;" alt="jussike"/>
                    <br />
                    <sub><b>jussike</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/kad3nce">
                    <img src="https://avatars.githubusercontent.com/u/556?v=4" width="100;" alt="kad3nce"/>
                    <br />
                    <sub><b>kad3nce</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/jlmcdonald">
                    <img src="https://avatars.githubusercontent.com/u/3506893?v=4" width="100;" alt="jlmcdonald"/>
                    <br />
                    <sub><b>jlmcdonald</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/revolter">
                    <img src="https://avatars.githubusercontent.com/u/5748627?v=4" width="100;" alt="revolter"/>
                    <br />
                    <sub><b>revolter</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/emilepommier">
                    <img src="https://avatars.githubusercontent.com/u/36151637?v=4" width="100;" alt="emilepommier"/>
                    <br />
                    <sub><b>emilepommier</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/3dd13">
                    <img src="https://avatars.githubusercontent.com/u/223555?v=4" width="100;" alt="3dd13"/>
                    <br />
                    <sub><b>3dd13</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/bent0b0x">
                    <img src="https://avatars.githubusercontent.com/u/7697924?v=4" width="100;" alt="bent0b0x"/>
                    <br />
                    <sub><b>bent0b0x</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/wijloc">
                    <img src="https://avatars.githubusercontent.com/u/16838209?v=4" width="100;" alt="wijloc"/>
                    <br />
                    <sub><b>wijloc</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/liamsegura">
                    <img src="https://avatars.githubusercontent.com/u/102547056?v=4" width="100;" alt="liamsegura"/>
                    <br />
                    <sub><b>liamsegura</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/shaharmor">
                    <img src="https://avatars.githubusercontent.com/u/10861920?v=4" width="100;" alt="shaharmor"/>
                    <br />
                    <sub><b>shaharmor</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/PNixx">
                    <img src="https://avatars.githubusercontent.com/u/1117351?v=4" width="100;" alt="PNixx"/>
                    <br />
                    <sub><b>PNixx</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/kolpax">
                    <img src="https://avatars.githubusercontent.com/u/3372392?v=4" width="100;" alt="kolpax"/>
                    <br />
                    <sub><b>kolpax</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/arielfurtado">
                    <img src="https://avatars.githubusercontent.com/u/7703845?v=4" width="100;" alt="arielfurtado"/>
                    <br />
                    <sub><b>arielfurtado</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/chooh">
                    <img src="https://avatars.githubusercontent.com/u/9463?v=4" width="100;" alt="chooh"/>
                    <br />
                    <sub><b>chooh</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/ogunkarakus">
                    <img src="https://avatars.githubusercontent.com/u/14255843?v=4" width="100;" alt="ogunkarakus"/>
                    <br />
                    <sub><b>ogunkarakus</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/nicolaswalcker">
                    <img src="https://avatars.githubusercontent.com/u/50677753?v=4" width="100;" alt="nicolaswalcker"/>
                    <br />
                    <sub><b>nicolaswalcker</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/KingHorse2015">
                    <img src="https://avatars.githubusercontent.com/u/15171668?v=4" width="100;" alt="KingHorse2015"/>
                    <br />
                    <sub><b>KingHorse2015</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/markx">
                    <img src="https://avatars.githubusercontent.com/u/1816385?v=4" width="100;" alt="markx"/>
                    <br />
                    <sub><b>markx</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/jfairley">
                    <img src="https://avatars.githubusercontent.com/u/992483?v=4" width="100;" alt="jfairley"/>
                    <br />
                    <sub><b>jfairley</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/medeeiros">
                    <img src="https://avatars.githubusercontent.com/u/331136?v=4" width="100;" alt="medeeiros"/>
                    <br />
                    <sub><b>medeeiros</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/skrater">
                    <img src="https://avatars.githubusercontent.com/u/3642917?v=4" width="100;" alt="skrater"/>
                    <br />
                    <sub><b>skrater</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/diegosperes">
                    <img src="https://avatars.githubusercontent.com/u/2347485?v=4" width="100;" alt="diegosperes"/>
                    <br />
                    <sub><b>diegosperes</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/chriswiggins">
                    <img src="https://avatars.githubusercontent.com/u/2830609?v=4" width="100;" alt="chriswiggins"/>
                    <br />
                    <sub><b>chriswiggins</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/celiolatorraca">
                    <img src="https://avatars.githubusercontent.com/u/43214?v=4" width="100;" alt="celiolatorraca"/>
                    <br />
                    <sub><b>celiolatorraca</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/ahmadmayahi">
                    <img src="https://avatars.githubusercontent.com/u/1689910?v=4" width="100;" alt="ahmadmayahi"/>
                    <br />
                    <sub><b>ahmadmayahi</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/lucasbraganca-tw">
                    <img src="https://avatars.githubusercontent.com/u/77497129?v=4" width="100;" alt="lucasbraganca-tw"/>
                    <br />
                    <sub><b>lucasbraganca-tw</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Lucbm99">
                    <img src="https://avatars.githubusercontent.com/u/45500959?v=4" width="100;" alt="Lucbm99"/>
                    <br />
                    <sub><b>Lucbm99</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Bugadinho">
                    <img src="https://avatars.githubusercontent.com/u/31747009?v=4" width="100;" alt="Bugadinho"/>
                    <br />
                    <sub><b>Bugadinho</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/nemesisqp">
                    <img src="https://avatars.githubusercontent.com/u/1621069?v=4" width="100;" alt="nemesisqp"/>
                    <br />
                    <sub><b>nemesisqp</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Rakesh9100">
                    <img src="https://avatars.githubusercontent.com/u/73993775?v=4" width="100;" alt="Rakesh9100"/>
                    <br />
                    <sub><b>Rakesh9100</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/rpadovani">
                    <img src="https://avatars.githubusercontent.com/u/1713343?v=4" width="100;" alt="rpadovani"/>
                    <br />
                    <sub><b>rpadovani</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/timgates42">
                    <img src="https://avatars.githubusercontent.com/u/47873678?v=4" width="100;" alt="timgates42"/>
                    <br />
                    <sub><b>timgates42</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/CommanderRoot">
                    <img src="https://avatars.githubusercontent.com/u/4395417?v=4" width="100;" alt="CommanderRoot"/>
                    <br />
                    <sub><b>CommanderRoot</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/LiShiSangZi">
                    <img src="https://avatars.githubusercontent.com/u/387171?v=4" width="100;" alt="LiShiSangZi"/>
                    <br />
                    <sub><b>LiShiSangZi</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/moni33">
                    <img src="https://avatars.githubusercontent.com/u/90513592?v=4" width="100;" alt="moni33"/>
                    <br />
                    <sub><b>moni33</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/hugocm99">
                    <img src="https://avatars.githubusercontent.com/u/33068028?v=4" width="100;" alt="hugocm99"/>
                    <br />
                    <sub><b>hugocm99</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/fabiohcnobre">
                    <img src="https://avatars.githubusercontent.com/u/22354660?v=4" width="100;" alt="fabiohcnobre"/>
                    <br />
                    <sub><b>fabiohcnobre</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Bubblesphere">
                    <img src="https://avatars.githubusercontent.com/u/8861575?v=4" width="100;" alt="Bubblesphere"/>
                    <br />
                    <sub><b>Bubblesphere</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/brinobruno">
                    <img src="https://avatars.githubusercontent.com/u/81701584?v=4" width="100;" alt="brinobruno"/>
                    <br />
                    <sub><b>brinobruno</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/brunacm-dev">
                    <img src="https://avatars.githubusercontent.com/u/71555436?v=4" width="100;" alt="brunacm-dev"/>
                    <br />
                    <sub><b>brunacm-dev</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/poshe">
                    <img src="https://avatars.githubusercontent.com/u/4026615?v=4" width="100;" alt="poshe"/>
                    <br />
                    <sub><b>poshe</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Ronkiro">
                    <img src="https://avatars.githubusercontent.com/u/27526023?v=4" width="100;" alt="Ronkiro"/>
                    <br />
                    <sub><b>Ronkiro</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/Abubakrce19">
                    <img src="https://avatars.githubusercontent.com/u/104122959?v=4" width="100;" alt="Abubakrce19"/>
                    <br />
                    <sub><b>Abubakrce19</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/ahu">
                    <img src="https://avatars.githubusercontent.com/u/330336?v=4" width="100;" alt="ahu"/>
                    <br />
                    <sub><b>ahu</b></sub>
                </a>
            </td>
		</tr>
	<tbody>
</table>
<!-- readme: contributors -end -->

See the full list on our [contributors page](https://github.com/clappr/clappr/graphs/contributors).

## License

[BSD-3-Clause](LICENSE) © Globo.com
