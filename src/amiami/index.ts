
import { JSDOM } from "jsdom";
import axios from "axios";
//import puppeteer from 'puppeteer';
import puppeteer from 'puppeteer-extra';

const StealthPlugin = require('puppeteer-extra-plugin-stealth')

import {executablePath} from 'puppeteer';
//const {executablePath} = require('puppeteer')

interface IFigure {
    code: string | undefined;
    url: string | null;
    imageurl: string | null;
    title: string | null;
} 

export class Amiami {


    typeList: Array<string> = [];

    async fetchAmiamiList() {
        return new Promise( async (resolve, reject) => {
  
            const navigator = await puppeteer.use(StealthPlugin()).launch({headless: true, executablePath: executablePath(), args: ['--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certifcate-errors',
            '--ignore-certifcate-errors-spki-list',
            '--user-agent="Mozilla/5.0 (X11; Linux x86_64; rv:99.0) Gecko/20100101 Firefox/99.0"']});
            
            const page = await navigator.newPage();
            page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64; rv:99.0) Gecko/20100101 Firefox/99.0');
            await page.goto('https://www.amiami.com/files/eng/new_items/1001.html', {waitUntil: 'load'});
            //await page.goto('file:///home/kurisu/Downloads/1001.html', {waitUntil: 'load'});
            
            console.log('test');
            
            try {
                const html = await page.content();
                let dom = new JSDOM(html);
                console.log(html);
                let urlList = Array.from(dom.window.document.querySelectorAll("li>a")).map((node: any) => {
                    return node.getAttribute("href");
                });
                let nodeList = Array.from(dom.window.document.querySelectorAll("li>a")).map((node: any) => {
                    return node;
                });
                let imageurlList = Array.from(dom.window.document.querySelectorAll("img")).map((node: any) => {
                    return node.getAttribute("data-src");
                });
                console.log(urlList);
                await navigator.close();            
                resolve({
                    urlList,
                    nodeList,
                    imageurlList
                });
            } catch(ex) {
                await navigator.close();
            }
        });
    }

    async fetchAmiamiLatest(): Promise<IFigure[]> {
        return new Promise((resolve, reject) => {
            let figures = <IFigure[]>[];
            this.fetchAmiamiList().then(async (result: any) => {
                result.urlList.forEach(async (url: string, key: string) => {
                    let figure: IFigure = await this.parseForFigure(result, url);
                    if(figure.code !== undefined)
                    {
                        figures.push(figure);
                    }
                    
                    
                });
                resolve(figures);
            })
        })
    }

   async parseForFigure(resultLists: any, url: string): Promise<IFigure> {
            let code = url?.split('=')[1];
            let figure: IFigure = {
                code: undefined,
                url: null,
                imageurl: null,
                title: null,
            };

            if(code?.split('-')[0] === 'FIGURE') {
                resultLists.imageurlList.forEach((link: string, index: string) => {
                    let fileName = link?.split('/')[link.split('/').length-1];
                    let codeInFileName = fileName?.split('.')[0];
                    if(codeInFileName === code)
                    {
                        figure['code'] = code;
                        figure['url'] = url;
                        figure['imageurl'] = link;
                        resultLists.nodeList.forEach((val: any, k: string) => {
                            if(url === val.getAttribute('href')) {
                                figure['title'] = val.getAttribute('alt');
                                
                            }  
                        });
                    }
                })
            }

            return figure;
    }

}