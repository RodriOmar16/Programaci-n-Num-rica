import java.util.Scanner;

public class Polinomio {
	private String expresion;
	private int grado;
	private double[] coef; 				private int cantTerminos;
	private double[] raicesEnteras; 	private int cantEnteras;
	private double[] raicesRacionales; 	private int cantRacionales;
	private double[] raicesReales; 		private int cantReales;
	private double[] raicesComplejas;	private int cantComplejas;
	
	public Polinomio(int n){
		this.grado 			= n;
		this.cantTerminos 	= this.grado+1;
		coef = new double[this.cantTerminos];
	}

	public void cargarArray(){
        Scanner teclado = new Scanner(System.in);
        int i, n = this.cantTerminos;
	          
        for(i=(n-1);i>0;i--){
    		if(i != (n-1)){
	                System.out.print("Ingresar coeficiente para el exponente "+i+": ");
	            this.coef[i] = teclado.nextDouble();
	        }else {
	            do{
	                System.out.print("Ingresar coeficiente para el exponente "+i+": ");
	                this.coef[i] = teclado.nextDouble();
	            }while(this.coef[i] == 0);
	        }
	    }
	    System.out.print("Ingresar coeficiente para del término independiente: ");
	    this.coef[i] = teclado.nextDouble();
	    
	    teclado.close();
	}
	
	public void cargarArrayLagrange(){
        Scanner teclado = new Scanner(System.in);
        int n = this.cantTerminos;
               
        do{
        	System.out.print("Ingresar coeficiente principal: ");
            coef[0] = teclado.nextDouble();
        }while(coef[0] == 0);
        
        for(int i=1; i<n ;i++){
        	if(i != (n-1)){
	            System.out.print("Ingresar coeficiente para el exponente "+(n-i-1)+": ");
	            coef[i] = teclado.nextDouble();
	        }else {
	        	System.out.print("Ingresar término independiente: ");
                coef[i] = teclado.nextDouble();
	    	}
        }
	}

	public void construirExpresion(){
	    String cad = "";
	    int i, n = this.cantTerminos;;
	    for(i=(n-1);i>=0;i--){
	        if(this.coef[i] >= 0){
	            if(i!=(n-1)){
	                cad += "+";
	            }
	        }
	        if(i==0){
	            cad = cad + " "+ this.coef[i];
	        }else{
	            if(i==1){
	                if(this.coef[i] == 1){
	                    cad += " x ";
	                }else{
	                    if(this.coef[i] == -1){
	                        cad += "- x ";
	                    }
	                    else {
	                      cad = cad + " " + this.coef[i] + "x ";
	                    }
	                }
	            }else{
	                if(this.coef[i] == 1){
	                    cad += " x^"+i+" ";
	                }else{
	                    if(this.coef[i] == -1){
	                        cad += "- x^"+i+" ";
	                    }
	                    else cad = cad +" "+ this.coef[i] + "x^"+i+" ";
	                }
	            }
	        }
	    }

	    this.expresion = cad;
	}
	  
	public void mostrarCoef() {
		System.out.println("P(x) = "+this.expresion);
	}
	    
	public void construirExpresionHorner(int a){
		String cad = "";
		int i, n = this.cantTerminos;
		int e = (n-1) - a;
		
		for(i=(n-1);i>=a;i--){
		    if(this.coef[i] >= 0){
		        if(i!=(n-1)){
		            cad += "+";
		        }
		    }
		    if(e==0){
		        cad = cad + " "+ this.coef[i];
		    }else{
		        if(e==1){
		            if(this.coef[i] == 1){
		                cad += " x ";
		            }else{
		                if(this.coef[i] == -1){
		                    cad += "- x ";
		                }
		                else {
		                  cad = cad + " " + this.coef[i] + "x ";
		                }
		            }
		        }else{
		            if(this.coef[i] == 1){
		                cad += " x^"+e+" ";
		            }else{
		                if(this.coef[i] == -1){
		                    cad += "- x^"+e+" ";
		                }
		                else cad = cad +" "+ this.coef[i] + "x^"+e+" ";
		            }
		        }
		    }
		    e--;
		}
		this.expresion = cad;
	}
	 
	public void mostrarCoefHorner() {
		 System.out.println("P(x) = "+this.expresion); 
	}
	
	public int getCantTerminos() {
		return this.cantTerminos;
	}
	
	public int getGrado() {
		return this.grado;
	}
	
	public double[] getCoef() {
		return this.coef;
	}
	
    public double newtonPolinomios(double xn1, double epsilon) {
    	double xn;
    	double[] dpP = new double[2];
    	
    	do {
    		xn = xn1;
        	dpP = hornerNewton(xn1);
        	xn1 = xn - (dpP[0]/dpP[1]);
        	System.out.println("xn: "+xn+"\nxn1: "+xn1);
        }while(Math.abs(xn1 - xn) > epsilon);
      
    	return xn1;
    }

    private double[] hornerNewton(double a) {
	    int i, n = this.cantTerminos;
	    double[] nh = new double[2];
	    double dp = 0, p = coef[n-1];
    
		for(i = (n-2); i>=0 ;i--) {
			dp = a*dp + p;
			p = p*a + this.coef[i];
		}
		nh[0] = p;
		nh[1] = dp;
    
		return nh;
    }

    public double[] hornerDobleCaso2(double a, double b, double c) {
    	int n = this.cantTerminos;
    	b/=a;
    	c/=a;
		double[] cx = hornerDobleCaso1(b, c);
		//mostrarCoefHorner(coef, 2, n );
		for(int i = (n-1); i>1 ;i--){
			cx[i] /= a;
		}
		return cx;
	}

    public double[] hornerDobleCaso1(double a, double b) {
    	int n = this.cantTerminos;
    	double[] c = new double[n];
    	a *=-1;      b *=-1;
    	c[n-1] = coef[n-1];
    	c[n-2] = a*c[n-1] + coef[n-2];
    	int i;
    	for(i=(n-3); i>0 ;i--) {
    		c[i] = coef[i] + a*c[i+1] + b*c[i+2];
    	}
    	c[0] = coef[0] + b*c[2];
    	return c;
    }
  
    public double[] hornerSimpleCaso2(double a, double b) {
    	int n 		= this.cantTerminos;
    	double[] c 	= new double[n];
    	
    	b 			= b/a;
    	c 			= hornerSimpleCaso1(-1*b);
    	for(int i = (n-1); i>=1 ;i--) {
    		c[i] /= a;
    	}
    	
    	return c;
    }

    public double[] hornerSimpleCaso1(double a) {
    	int n = this.cantTerminos;
    	double[] c = new double[n];
    	
    	c[n-1] = coef[n-1];    
    	for(int i=n-2;i >= 0;i--) {
    		c[i] = a*c[i+1] + coef[i];
    	}
    	
    	return c;
    }
	
	public double evaluarPolinomio(double c[], int n,double a){
	    double p = 0;
	    //int n = this.cantTerminos;
	    /*System.out.println("evaluar:");
	    for(int i = this.cantTerminos-1;i>=0;i--) {
	    	System.out.print("\tc["+i+"]: "+c[i]+"\n");
	    }*/
	    
	    for(int i=n-1;i>=0;i--){
	        p = p*a + c[i];
	    }
	    return p;
	}
    
    private double[] divisoresNro(double nro) {
    	int c = 0;
        
        double[] posiblesRaices = new double[(int) nro];
    	if(nro == 1) { 
        	posiblesRaices[c] = (double)1;
        	c = 1;
        }else{
            if(nro==2 || nro==3 || nro==5 || nro==7){
            	posiblesRaices[0] = (double)1;
            	posiblesRaices[1] = (double)nro;
            	c = 2;
            }else{
                int d = 1;
                double max = nro/2;
            	c = 0;
                while(d <= max){
                    if(nro%d == 0){
                    	posiblesRaices[c] = (double)d;
                        c++; 
                    }
                    d++;
                }
                posiblesRaices[c] = (double)nro;
                c++;
            }
        }
    	return posiblesRaices;
    }
	
	public void detEnteras(){

        double nro = Math.abs(this.coef[0]);

        if(nro != 0){
        	
        	double[] posiblesRaices = divisoresNro(nro);
        	//el array posiblesRaices viene posiblemente con más elementos 0(ceros) que con divisores
        	int n = posiblesRaices.length, c = n;
        	for(int i = 0 ;i <n ; i++) {
        		if(posiblesRaices[i] == 0) {
        			c--;
        		}
        	}
        	
            //------------------------------------------------------------------
        	//c es el que efectivamente sabe la cantidad devuelta por divisoresNro
            double raices[] = new double[c*2], rAux, r;
            int tam = 0;
            //POSITIVAS
            for(int i = 0; i < c ; i++) {
        		rAux = posiblesRaices[i];
            	if(rAux != 0) {
            		r = (hornerSimpleCaso1( rAux ))[0];
                	if(r == 0){
                		raices[tam] = rAux; 
                		tam++;
                	}
            	}
            }
            //NEGATIVAS
            for(int i = 0; i < c ; i++) {
            	rAux = -1 * posiblesRaices[i];
            	if(rAux != 0){
            		r = (hornerSimpleCaso1( rAux ))[0];
                	if(r == 0){
                		raices[tam] = rAux; 
                		tam++;
                	}
            	}
            }
            this.cantEnteras = tam;
            this.raicesEnteras = new double[tam];
            this.raicesEnteras = raices;
        }else {
        	this.raicesEnteras 	= new double[0];
        	this.cantEnteras 	= 0;
        }
	}
	
	public double[] getRaicesEnteras() {
		return this.raicesEnteras;
	}
	
	public int getCantEnteras() {
		return this.cantEnteras;
	}
	
	private int mcd(int a, int b){
		if(b == 0){
			return a;
		}else
			return mcd(b, a%b);
	}
	
	private int mcm(int a, int b) {
		return (a*b)/mcd(a,b);
	}
	
	public void detRacionales() {
		double nro = Math.abs(this.coef[0]);
		if(nro != 0) {
			double rEnteras[] = divisoresNro(nro);
					
	    	int n = rEnteras.length, c = n;
	    	for(int i = 0 ;i <n ; i++) {
	    		if(rEnteras[i] == 0) {
	    			c--;
	    		}	
	    	}
			nro = Math.abs(this.coef[this.cantTerminos - 1]);
	    	double[] rRacionales= divisoresNro(nro);
	    	n = rRacionales.length;
	    	int c1 = n;
	    	for(int i = 0 ;i <n ; i++) {
	    		if(rRacionales[i] == 0) {
	    			c1--;
	    		}
	    	}
	    	int tam = 0, aux;
	    	double[] posiblesRaices = new double[c*c1];
	    	
	    	for(int i=0; i < c ;i++) {
	    		for(int j=0; j < c1 ; j++) {
	    			aux = (int) (rEnteras[i]/rRacionales[j]);
	    			if(mcd((int)rEnteras[i],(int)rRacionales[j]) == 1 && aux != rEnteras[i]/rRacionales[j]) {
	    				posiblesRaices[tam] = rEnteras[i]/rRacionales[j];
	    				tam++;
	    			}
	    		}
	    	}
	    	c = tam;
	    	tam = 0;
	    	double raices[] = new double[c], r, rAux;
	    	//POSITIVAS
	    	for(int i=0; i < c ;i++) {
	    		rAux = posiblesRaices[i];
	    		r = (hornerSimpleCaso1(rAux))[0];
	    		if(r == 0) {
	    			raices[tam] = rAux;
	    			tam++;
	    		}
	    	}
	    	//NEGATIVAS
	    	for(int i=0; i < c ;i++) {
	    		rAux = -1 * posiblesRaices[i];
	    		r = (hornerSimpleCaso1(rAux))[0];
	    		if(r == 0) {
	    			raices[tam] = rAux;
	    			tam++;
	    		}
	    	}
	    	
			this.raicesRacionales 	= raices;
			this.cantRacionales 	= tam;
		}else { 
			this.raicesRacionales 	= new double[0];
			this.cantRacionales 	= 0;
		}
	}
	
	public double[] getRaicesRacionales() {
		return this.raicesRacionales;
	}
	
	public int getCantRacionales() {
		return this.cantRacionales;
	}
	
	private double maxNegativo(double cx[], int n) {
		double max = 0;
		for(int i = 0 ; i<n ;i++) {
			if(cx[i] < 0){
				if(Math.abs(cx[i]) > max) {
					max = Math.abs(cx[i]);
				}
			}
		}
		
		return  max;
	}
	
	private int primerNegativo(double cx[], int n) {
		int i = 0;
		boolean negativo = false;
		while(i < n && !negativo) {
			if(cx[i] < 0) {
				negativo = true;
			}else i++;
			
		}
		if(i < n){
			return i;
		}else return -1;
	}
	
	private double lagrange(double a[], int n) {
		double cotas = 0;
		
		double a0 = a[0], m = maxNegativo(a, n), base = m/a0, expo;
		int k = primerNegativo(a, n);
		expo = 1/(double)k;

		cotas = 1 + Math.pow(base, expo);
		
		return cotas;
	}
	
	private double laguerre(double cota, double[] a, int n) {	
		int j=0;
    	double c[] = new double[n], x = 0, anterior = cota;  	
    	
    	boolean neg = false;
    	while(!neg && j < 10000) {
    		int i = n-2;
    		c[n-1] = a[n-1];
    		while(i >= 0 && !neg) {
        		x = cota*c[i+1] + a[i];      		
        		if(x <= 0) {
        			neg = true;
        		}
        		c[i] = x;
        		i--;
        	}
        	
        	if(i < 0) {
        		anterior = cota;
        	}
    		cota -= 0.01; //refinas
        	j++;
    	}
    	return anterior;
	}
	
	private double newton(double cota, double[] a, int n) {	
		int j = n-1, i, m = n, t= 0, max = 1000;
    	double aux[] = new double[n], c[] = new double[n], x = 0, anterior = 0;  	
    	boolean parar = false, refinar = true;
    	
    	for(i = n-1 ; i>=0 ; i--){
    		aux[i] = a[i];
    	}
    	   	
    	while(refinar && t < max) {
    		while(!parar && n!=0) {
        		x = evaluarPolinomio(aux, n, cota);
        		if(x <= 0) {
        			parar = true;
        		}else {
        	    	//Guarda copia de aux
        			for(i = n-1 ; i>=0 ; i--){
        	    		c[i] = aux[i];
        	    	}
        			//deriva a vez
        			for(i = n-1; i>=0 ;i--) {
            			if(i != 0) {
            				j = i-1;
            				aux[j] = c[i] * i;
            			}
                	}
        			//decrementa la cantidad (grado-1)
            		n--;
        		}
    		}
    		//System.out.println("refinar: "+refinar+"\tcota: "+cota+"\tparar: "+parar);
    		if(parar) {
    			refinar = false;
    		}else {
    			anterior = cota;
        		parar = false;
        		n = m;
        		for(i = n-1 ; i>=0 ; i--){
            		aux[i] = a[i];
            	}
        		cota -= 0.01; //refinas
    		}
    		t++;
    	}
    	if(t >= max) {
			System.out.println("Superó la cantidad máximas de iteraciones.!!!");
		}
    	return anterior;
	}
	
	private double[] detExpresionCotaInfPos(double[] c, int n) {
		double aux[] = new double[n];
		
		for(int i=0; i<n ;i++) {
			aux[n-i-1] = c[i];
		}
		return aux;
	}
	
	private double[] detExpresionCotaSupNeg(double[] c, int n) {
		double aux[] = new double[n];
		
		for(int i=0; i<n ;i++) {
			aux[n-i-1] = Math.pow(-1, (this.grado-i)) * c[i];
		}
				
		return aux;
	}
	
	private double[] detExpresionCotaInfNeg(double[] c, int n) {
		double aux[] = new double[n];
		
		for(int i=0; i<n ;i++) {
			aux[i] = Math.pow(-1, (this.grado-i)) * c[i];
		}
		return aux;
	}
	
	private double[] detExpresionCostas(int metodo, int cota) {
		int n = this.cantTerminos, j;
		double aux[] = new double[n], aux2[] = new double[n];

		//TRANSFORMA LOS COEF EN LAGRANGE
		if(metodo != 1) {
			j = 0;
			for(int i = (n-1); i>=0 ;i--) {
				aux[j] = coef[i];
				j++;					
			}
		}else {
			for(int i=0; i<n ;i++) {
				aux[i] = coef[i];					
			}
		}
		
		//DEPENDIENDO DEL CAMBIO DE VARIABLE QUE SE REQUIERE
		switch(cota) {
			case 1:
				aux = detExpresionCotaInfPos(aux,n);
				break;
			case 2:
				aux = detExpresionCotaSupNeg(aux,n);
				break;
			case 3:
				aux = detExpresionCotaInfNeg(aux,n);
				break;
		}
		
		//DADO QUE PARA ESTE PTO TODOS SIN LAGRANGE, SI ES NEGATIVO EL COEF. PRINCIPAL MULTIPLICA POR -1
		if(aux[0] < 0){
			for(int i=0; i<n ;i++) {
				aux[i] *= -1;
			}
			
		}
		
		//SI NO SE LLAMÓ A LAGRANGE VUELVE EL ORDEN
		if(metodo != 1) { //laguerre o newton
			j = n-1;
			for(int i = 0; i < n ;i++) {
				aux2[j] = aux[i];
				j--;					
			}
			//aux = aux2;
			for(int i=n-1; i>=0 ;i--) {
				aux[i] = aux2[i];
			}
			
		}
		
		return aux;
	}
	
	public double[] detCotas(int metodo, double inicial) {
		int n = this.cantTerminos;
		double cotas[] = new double[4],
				expresionCotaSupPos[] = detExpresionCostas(metodo,0),
				expresionCotaInfPos[] = detExpresionCostas(metodo,1), 
				expresionCotaSupNeg[] = detExpresionCostas(metodo,2), 
				expresionCotaInfNeg[] = detExpresionCostas(metodo,3);
		
		switch(metodo) {
			case 1: //lagrange
				cotas[3] = lagrange(expresionCotaSupPos, n);
				cotas[2] = lagrange(expresionCotaInfPos, n); 
				cotas[1] = lagrange(expresionCotaSupNeg, n); 
				cotas[0] = lagrange(expresionCotaInfNeg, n);
				break;
			case 2: //laguerre
				cotas[3] = laguerre(inicial, expresionCotaSupPos, n);
				cotas[2] = laguerre(inicial, expresionCotaInfPos, n); 
				cotas[1] = laguerre(inicial, expresionCotaSupNeg, n); 
				cotas[0] = laguerre(inicial, expresionCotaInfNeg, n);
				break;
			case 3: //newton
				cotas[3] = newton(inicial, expresionCotaSupPos, n);
				cotas[2] = newton(inicial, expresionCotaInfPos, n); 
				cotas[1] = newton(inicial, expresionCotaSupNeg, n); 
				cotas[0] = newton(inicial, expresionCotaInfNeg, n);
				break;
		}
		
		cotas[2] = 1/cotas[2]; //t < cota => 1/t > 1/cota => 1/cota < x
		cotas[1] = (-1) * (1/cotas[1]);// t < cota => 1/t > 1/cota => -1/t < -1/cota => x < -1/cota
		cotas[0] *= -1;//  t < cota => -t > -cota => -cota < x
		
		return cotas;
	}
	
	private double[] hornerDobleBairstow(double coefi[], int n,double a, double b) {
    	double[] c = new double[n];
    	
    	a *=-1;      b *=-1;

    	c[n-1] = coefi[n-1];
    	c[n-2] = a*c[n-1] + coefi[n-2];
    	int i;
    	for(i=(n-3); i>0 ;i--) {
    		c[i] = coefi[i] + a*c[i+1] + b*c[i+2];
    	}
    	c[0] = coefi[0] + b*c[2];
    	
    	return c;
    }
	
	private double[][] formulaCuadratica(double b, double c) {
		double a = 1, disc = b*b - 4*a*c, xr[][] = new double[2][2];
		
		if(disc>=0) {
			System.out.println("\nentroo if..."+"\t a: "+a+"\t b: "+b+"\t c: "+c+"\n");
			//parte reales							//parte imaginaria
			xr[0][0] = (-b + Math.sqrt(disc))/2; 	xr[0][1] = 0;
			xr[1][0] = (-b - Math.sqrt(disc))/2; 	xr[1][1] = 0;
		}else {
			System.out.println("\nentroo else..."+"\t a: "+a+"\t b: "+b+"\t c: "+c+"\n");
			//parte reales  	//imaginarias
			xr[0][0] = b/2; 	xr[0][1] = (Math.sqrt(Math.abs(disc)))/2;
			xr[1][0] = b/2; 	xr[1][1] = -1*xr[0][1];
		}
		
		return xr;
	}
	
	public void bairstow(double epsilon, double r, double s, int maxIter) {
		int g = this.grado, n = g+1, iter = 0;
		double det = 0, dr=0, ds=0, errorR=1, errorS=1;
		double[] b 			 = new double[g+1],
				 c 			 = new double[g+1],
				 p 			 = new double[g+1],
				 reales 	 = new double[g],
				 imaginarias = new double[g];
		double raicesPar[][]= new double[2][2];
		
		
		//crea una copia editable del coef P(x) original
		for(int i=(this.cantTerminos-1); i>=0 ;i--) {
			p[i] = coef[i];
		}
		
		while(g>2 && iter<=maxIter) {
			iter = 0; errorR=1; errorS=1;
			System.out.println("en el while, antes del do-while");
			do {
				iter++;
				b = hornerDobleBairstow(p,n,-1*r,-1*s);
				c = hornerDobleBairstow(b,n,-1*r,-1*s);
				
				det = Math.pow(c[2],2) - (c[1]*c[3]);
				
				if(det != 0) {
					dr = (b[0]*c[3]-b[1]*c[2])/(det);
					ds = (b[1]*c[1]-b[0]*c[2])/(det);

					r += dr;
					s += ds;
					
					errorR = Math.abs(dr/r);
					errorS = Math.abs(ds/s);

				}else {
					r += 1;
					s += 1;
					iter = 0;
				}
			}while((errorR > epsilon || errorS > epsilon) && (iter <= maxIter));
			//r = Math.round(r); s = Math.round(s);

			raicesPar 		= formulaCuadratica(-1*r,-1*s);
			
			reales[g-1] 		= /*Math.round(*/raicesPar[0][0]/*)*/;
			imaginarias[g-1] 	= raicesPar[0][1];
			
			reales[g-2] 		= /*Math.round(*/raicesPar[1][0]/*)*/;
			imaginarias[g-2] 	= raicesPar[1][1];
			
			b = hornerDobleBairstow(p,n,-1*r,-1*s);
			g -= 2;	n -= 2;		
			for(int i=n-1; i>=0 ;i--) {
				p[i] = b[i+2];
				System.out.println("p["+i+"]: "+p[i]);
			}
			
		}
		if(iter <= maxIter) {
			if(g == 2) {
				r 			= (p[1]/p[2]);
				s 			= (p[0]/p[2]);
				raicesPar 	= formulaCuadratica(r,s);
				reales[g-1] 		= raicesPar[0][0];
				imaginarias[g-1] 	= raicesPar[0][1];
				
				reales[g-2] 		= raicesPar[1][0];
				imaginarias[g-2] 	= raicesPar[1][1];
			}else {
				reales[0] 		= -(p[0]/p[1]);
				imaginarias[0] 	= 0;
			}
		}
		System.out.println("");
		for(int j=0; j<this.cantTerminos-1 ;j++) {
			System.out.println("real["+j+"]: "+reales[j]);
			System.out.println("imaginarias["+j+"]: "+imaginarias[j]);
		}
	}
		
	
 }
