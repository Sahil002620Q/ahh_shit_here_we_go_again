#include <stdio.h> 
int main () {
    int n;
    int c;
    printf("enter the num upto which you want to have a table;\n");
    scanf("%d",&n);
    for(int i=1;i<=10;i++){
        c=i*n;
        printf("%d * %d = %d\n",n,i,c);
    }

}