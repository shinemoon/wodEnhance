// ==UserScript==
// @name         [WoD] Display Skill Rolls_CN
// @namespace    com.dobydigital.userscripts.wod
// @version      2021.06.27.8
// @description  Calculates skill rolls, and adds a new table column on the skills page.
// @author       XaeroDegreaz
// @home         https://github.com/XaeroDegreaz/world-of-dungeons-userscripts
// @supportUrl   https://github.com/XaeroDegreaz/world-of-dungeons-userscripts/issues
// @source       https://raw.githubusercontent.com/XaeroDegreaz/world-of-dungeons-userscripts/main/src/display-skill-rolls.user.js
// @match        *://*.world-of-dungeons.org/wod/spiel/hero/skills*
// @icon         http://info.world-of-dungeons.net/wod/css/WOD.gif
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/439870/%5BWoD%5D%20Display%20Skill%20Rolls_CN.user.js
// @updateURL https://update.greasyfork.org/scripts/439870/%5BWoD%5D%20Display%20Skill%20Rolls_CN.meta.js
// ==/UserScript==

//Quite interesting that seems $ is override... we need to take it back;
$ = jQuery;
const storage = window.localStorage;
const SKILL_ROLLS_STORAGE_KEY = 'com.dobydigital.userscripts.wod.displayskillrolls.skillrollslist';

if (window.location.href.indexOf("/hero/skills") >= 0) {
  function loadHeroAttributes() {
    return new Promise(function (resolve) {
      function fetchHeroAttributes() {
        return new Promise(function (resolve, reject) {
          $.ajax({
            url: '/wod/spiel/hero/attributes.php',
            type: 'GET',
            crossDomain: true,
            success: function (data) {
              resolve(data);
            },
            error: function (xhr, status, error) {
              reject(new Error("Failed to fetch hero attributes"));
            }
          });
        });
      }
      fetchHeroAttributes()
        .then(function (data) {
          resolve(parseHeroAttributes(data));
        })
        .catch(function (error) {
          console.error("Error fetching hero attributes", error);
        });
    });
  }

  function parseHeroAttributes(data) {
    const jq = $(data);
    const attributesTable = jq.find('table[class=content_table]').first();
    if (!attributesTable.length) {
      console.error('NOPE.', attributesTable);
      return;
    }
    const attributeRows = $(attributesTable).find('tr[class^=row]')
    const rawRows = attributeRows
      .map(function () {
        const cells = $(this).find('> td');
        const attributeName = cells
          .first()
          .text()
          .trim();
        const valueCell = cells
          .find(':nth-child(2)')
          .contents()
          .filter(function () {
            return this.nodeType == 3;
          })
          .text()
          .trim();
        const effectiveValueCell = cells
          .find(':nth-child(2) > span[class=effective_value]')
          .text()
          .trim()
          .replace(/\D/g, '');
        return { attributeName, valueCell, effectiveValueCell };
      })
      .toArray();
    const retVal = {};
    rawRows.forEach(function (x) {
      retVal[x.attributeName] = x.effectiveValueCell.length > 0 ? Number(x.effectiveValueCell) : Number(x.valueCell);
    });
    return retVal;
  }

  function parseAttackRolls(data) {
    const jq = $(data);
    const markers = jq.find('li').map(function () {
      const match = /^(?<rollType>.+)公式为：(?<rollCalculation>.+?)( \((?<modifier>[+\-]\d*%?)\))?$/g.exec($(this).text());
      if (!match) {
        return;
      }
      const { rollType, rollCalculation, modifier } = match.groups;
      return { rollType, rollCalculation, modifier };
    }).toArray();
    return markers;
  }

  async function calculateSkillRoll(heroAttributes, skillName, skillLevel, rollCalculation, modifier) {
    let replaced = rollCalculation.replaceAll(skillName, skillLevel).trim();
    Object.keys(heroAttributes).forEach(function (key) {
      replaced = replaced.replaceAll(key, heroAttributes[key]);
    });
    replaced = replaced.replaceAll('×', '*');
    replaced = replaced.replaceAll('÷', '/');
    replaced = replaced.replaceAll('２', '2');
    replaced = replaced.replaceAll('３', '3');
    replaced = replaced.replaceAll('＋', '+');

    // Use messaging to calculate the result in the background script
    const result = await new Promise(resolve => {
      chrome.runtime.sendMessage({ action: 'calculateStr', data: replaced }, response => {
        console.log('Content script received response:', response);
        resolve(response.data);
      });
    });

    const roll = result;
    const modifierAsNumber = Number(modifier?.replaceAll(/\D/g, ''));
    const modifierAsFraction = modifierAsNumber / 100;
    const rollWithModifier = modifier
      ? modifier.endsWith('%')
        ? modifier.startsWith('+')
          ? roll * (1 + modifierAsFraction)
          : roll * (1 - modifierAsFraction)
        : modifier.startsWith('+')
          ? roll + modifierAsNumber
          : roll - modifierAsNumber
      : roll;

    return Math.floor(rollWithModifier);
  }


  function load(key) {
    try {
      const raw = storage?.getItem(key);
      return raw ? JSON.parse(raw) : undefined;
    }
    catch (e) {
      console.error(`Hero Selector Dropdown Userscript: Unable to load key:${key}`, e);
      return undefined;
    }
  }

  function save(key, value) {
    try {
      storage?.setItem(key, JSON.stringify(value));
    }
    catch (e) {
      console.error(`Hero Selector Dropdown Userscript: Unable to save key:${key}`, e);
    }
  }

  function main() {
    loadHeroAttributes().then(function (heroAttributes) {
      const shortAttributes = heroAttributes;
      console.log(shortAttributes);
      const contentTable = $('table[class=content_table]');
      const tbody = $(contentTable).find('> tbody');
      const header = $(tbody).find('> tr[class=header]');
      $(header).append('<th>Base Rolls</th>');
      const skillRows = $(tbody).find('tr[class^=row]');
      $(skillRows).each(async function () {
        const a = $(this).find('a');
        $(this).append('<td class="roll_placeholder">-</td>')
      });

      const skillRollData = load(SKILL_ROLLS_STORAGE_KEY) || {};
      $(skillRows).each(async function () {
        const row = $(this);
        $(row).find('input[type=image]').click(async function () {
          await renderRollData($(row), skillRollData, shortAttributes);
        });
        await renderRollData($(row), skillRollData, shortAttributes)
      });
    });
  }


  const renderRollData = async (row, skillRollData, shortAttributes) => {
    //console.log( "rendering")
    const a = $(row).find('a');
    const skill = $(a).text();
    const link = $(a).attr('href');
    //console.log( {skill, link} );
    const baseLevel = $(row).find('div[id^=skill_rang_]').text().trim();
    const effectiveLevel = $(row).find('span[id^=skill_eff_rang_]').text().replace(/\D/g, '').trim();
    const skillLevel = effectiveLevel.length > 0 ? Number(effectiveLevel) : Number(baseLevel);
    if (!skillLevel) {
      return;
    }

    if (!skillRollData?.[skill]) {
      const skillData = await new Promise(resolve => {
        GM.xmlHttpRequest({
          url: link,
          synchronous: false,
          onload: (data) => {
            resolve(data.responseText);
          }
        });
      });
      //console.log('qqqq',skillData);
      skillRollData[skill] = parseAttackRolls(skillData);
      save(SKILL_ROLLS_STORAGE_KEY, skillRollData);
    }
    //console.log( "data", skillRollData[skill] );
    if (skillRollData[skill].length === 0) {
      return;
    }

    const formattedPromises = skillRollData[skill].map(async x => {
      return {
        rollType: x.rollType,
        rollValue: await calculateSkillRoll(shortAttributes, skill, skillLevel, x.rollCalculation, x.modifier),
        rollCalculation: x.rollCalculation,
        modifier: x.modifier
      };
    });

    // Wait for all promises to resolve
    const formatted = await Promise.all(formattedPromises);

    console.log({ formatted });
    $(row)
      .find('td[class=roll_placeholder]')
      .replaceWith(`<td class="roll_placeholder"><table width="100%"><tbody>${formatted
        .map(x => {
          const modifierString = x.modifier ? `<b>(${x.modifier})</b>` : '';
          return `<tr onmouseover="return wodToolTip(this, '<b>${x.rollType}</b>: ${x.rollCalculation} ${modifierString}');">
                            <td align="left">
                                ${x.rollType}
                            </td>
                            <td align="right">
                                ${x.rollValue}                                
                            </td>
                            <td align="right">
                                <img alt="" border="0" src="/wod/css//skins/skin-8/images/icons/inf.gif">
                            </td>
                        </tr>`;
        })
        .join('')
        }</tbody></table></td>`);
  }
  main();
}

