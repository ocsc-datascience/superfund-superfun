--CREATE TABLE STATE_SUPERFUND_STATS AS
--SELECT STATE, AVG(HRSSCORE) AVG_HRSSCORE, COUNT(*)SF_SITE_COUNT
--FROM superfund_npl
--GROUP BY STATE;

CREATE TABLE STATE_COMBINED_STATS AS
SELECT CAST(STATE_SUPERFUND_STATS.SF_SITE_COUNT AS integer) SF_SITE_COUNT,
CAST(STATE_SUPERFUND_STATS.AVG_HRSSCORE AS REAL) AVG_HRSSCORE,
state_census_stats_2016."State",
state_census_stats_2016.State_Abbr,
CAST(state_census_stats_2016.Population AS integer) Population,
CAST(state_census_stats_2016.Percent_Veterans AS REAL) Pct_Veterans,
CAST(state_census_stats_2016.Percent_Below_Poverty AS REAL) Pct_Below_Poverty,
CAST(state_census_stats_2016.Median_Household_Income AS integer) Median_Household_Income,
CAST(state_census_stats_2016.Median_Age AS REAL) Median_Age,
CAST(state_census_stats_2016.Housing_units AS integer) Housing_Units,
CAST(state_census_stats_2016.'Area_in_square_miles-Land_area' AS REAL) Land_Area,
CAST(state_census_stats_2016.'Area_in_square_miles-Total_area' AS REAL) Total_Area,
CAST(state_census_stats_2016.'Area_in_square_miles-Water_area' AS REAL) Water_Area,
CAST(state_census_stats_2016.'Density_per_square_mile_of_land_area-Housing_units' AS REAL) Housing_Density,
CAST(state_census_stats_2016.'Density_per_square_mile_of_land_area-Population' AS REAL) Population_Density, 
CAST(state_cancer_incidence_2015.Average_Annual_Count AS REAL) Cancer_Incidence_Count,
CAST(state_cancer_incidence_2015.'Age-Adjusted_Incidence_Rate_per_100000' AS REAL) Cancer_Incicence_Rate,
CAST(state_cancer_prevalence_2017.Total_Cancer_Prevalence_Counts AS integer) Cancer_Prevalence_Count,
CAST(CAST(state_cancer_prevalence_2017.Total_Cancer_Prevalence_Counts as integer)*100000 / CAST(state_census_stats_2016.Population AS integer)as real) Cancer_Prevalence_Rate,
CAST(state_cancer_deaths_2015.Average_Annual_Count AS integer) Cancer_Death_Count,
CAST(state_cancer_deaths_2015.'Age-Adjusted_Death_Rate_per_100000' AS REAL) Cancer_Death_Rate
FROM state_census_stats_2016
INNER JOIN STATE_SUPERFUND_STATS ON state_census_stats_2016.State_Abbr = STATE_SUPERFUND_STATS.'STATE'
INNER JOIN state_cancer_deaths_2015 ON state_census_stats_2016.State_Abbr = state_cancer_deaths_2015.State_Abbr
INNER JOIN state_cancer_incidence_2015 ON state_census_stats_2016.State_Abbr = state_cancer_incidence_2015.State_Abbr
INNER JOIN state_cancer_prevalence_2017 ON state_census_stats_2016.State_Abbr = state_cancer_prevalence_2017.State_Abbr
;