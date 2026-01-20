#include <stdio.h>
#include <string.h>
     struct ex
     {
          int num;
         int gc;
          char txt[20];
     };
int main ()
{   // new variable xs1 carries value one int and one char and it will have only one int and one char of same name
    struct ex xs1 = {67,4,"faah"};    // use " " for text and don't use ' or " for num value
    printf("numeric val in exs1 = %d\n",xs1.num);
    printf("second numeric val in exs1 = %d\n",xs1.gc);
    printf("text val in exs1 = %s\n",xs1.txt);
}