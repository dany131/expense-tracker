import { Injectable } from "@nestjs/common";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { ExpensesPdf, IncomePdf } from "@types";


pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable()
export class PdfHelper {
  constructor() {
  }

  async generateSummaryPdf(
    totalIncome: number,
    incomeAmount: number,
    incomes: IncomePdf[],
    totalExpenses: number,
    expenseAmount: number,
    expenses: ExpensesPdf[],
    balance: number
  ) {
    const documentDefinition = {
      content: [
        {
          text: "Summary Report",
          style: "title"
        },
        {
          text: new Date().toLocaleDateString(),
          alignment: "right",
          style: "subheader"
        },
        { text: `Income Count: ${totalIncome}`, style: "header" },
        { text: `Income Amount: ${incomeAmount}`, style: "header" },
        {
          style: "tableData",
          table: {
            headerRows: 1,
            widths: ["auto", "auto", "*", "*"],
            body: [
              [
                { text: "Date", style: "tableHeader" },
                { text: "Amount", style: "tableHeader" },
                { text: "Source Name", style: "tableHeader" },
                { text: "Source Type", style: "tableHeader" }
              ],
              ...incomes.map(item => [
                item.date || "N/A",
                item.amount || "N/A",
                item.sourceName || "N/A",
                item.sourceType || "N/A"
              ])
            ]
          }
        },
        { text: `Expense Count: ${totalExpenses}`, style: "header" },
        { text: `Expense Amount: ${expenseAmount}`, style: "header" },
        {
          style: "tableData",
          table: {
            headerRows: 1,
            widths: ["auto", "auto", "*", "*"],
            body: [
              [
                { text: "Date", style: "tableHeader" },
                { text: "Amount", style: "tableHeader" },
                { text: "Category Name", style: "tableHeader" },
                { text: "Category Type", style: "tableHeader" }
              ],
              ...expenses.map(item => [
                item.date || "N/A",
                item.amount || "N/A",
                item.categoryName || "N/A",
                item.categoryType || "N/A"
              ])
            ]
          }
        },
        { text: `Balance: ${balance}`, style: "header" }
      ],
      styles: {
        title: {
          fontSize: 24,
          bold: true,
          margin: [0, 0, 0, 10],
          color: "blue",
          fillColor: "blue",
          alignment: "center"
        },
        header: {
          fontSize: 12,
          bold: true,
          margin: [0, 20, 0, 10]
        },
        subheader: {
          fontSize: 9,
          italics: true,
          margin: [0, 0, 0, 10]
        },
        tableData: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: "black",
          fillColor: "#f3f3f4"
        }
      },
      defaultStyle: {
        // alignment: 'justify'
      }
    };

    return pdfMake.createPdf(documentDefinition);
  }
}
