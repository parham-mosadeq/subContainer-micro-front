import { EMPTY_VALUE } from "@medad-mce/utils";
import { PluginFactory } from "@medad-mce/core";
import { BUTTONS } from './page-number.constants';

export class PageNumberPlugin extends PluginFactory {
    constructor() {
        super('pageNumber', {
            name: 'pageNumber'
        });
    }

    styles = `
        span.pdf-var {
            background-color: #ADF802;
            border-radius: 5px;
            padding: 0px 6px;
            text-decoration: underline;
        }
    `;

    private getSpanTemplate(className: string, innerData: string) {
        return `<span class="pdf-var ${className}">${innerData}</span>${EMPTY_VALUE}`;
    }

    private insertData(data: string): boolean | undefined {
        return this.editor?.execCommand('mceInsertContent', false, data);
    }

    onInit(): void {
        this.editor?.ui.registry.addButton(BUTTONS.pageNumber, {
            onAction: () => this.injectPageNumber(),
            text: 'pageNumber'
        });

        this.editor?.ui.registry.addButton(BUTTONS.totalPage, {
            onAction: () => this.injectTotalPageNumber(),
            text: 'totalPage'
        });
    }

    private injectPageNumber() {
        this.insertData(this.getSpanTemplate('pageNumber', '(page number)'));
    }

    private injectTotalPageNumber() {
        this.insertData(this.getSpanTemplate('totalPages', '(total page)'));
    }
}
